import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { CommonService } from '../../core/services/common.service';
import { generateUsers } from 'src/app/core/mocks/users.mock';
import { MessageService } from '../../core/services/message.service';
import { PartService } from 'src/app/core/services/part.service';
import { StitchService } from 'src/app/core/services/stitch.service';
import { User } from 'src/app/core/models/user/user.model';
// import { PartService } from 'src/app/core/services/part.service';
// import * as mockUsers from '../../mocks/users.mock';
// import { User } from '../../models/users.schema';
// import { any } from 'server/src/modules/users/user.schema';
// import { Part } from '../../models/parts.schema';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

/**
 * Get data about users from storage
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends CommonService {
  private usersUrl = 'api/user'; // URL to web api

  constructor(
    private http: HttpClient,
    messageService: MessageService,
    private partService: PartService,
    private authService: AuthService,
    private translate: TranslateService,
    protected stitchService: StitchService
  ) {
    super('users', 'UserService', messageService, stitchService);
  }

  async generateUsers(numberToGenerate: number = 50) {
    const parts = await this.partService.getParts();
    const generatedUsers = generateUsers(
      parts,
      this.authService.getUser().id,
      numberToGenerate
    );

    try {
      await this.callFunction('Users_insertMany', [generatedUsers]);

      this.log('generated users');
    } catch (error) {
      this.handleError('generateUsers', []);
    }
  }

  /**
   * Get all users from the server
   */
  async getUsers(
    sortField: string = 'lastName',
    sortOrder: string = 'ASC',
    pageSize: number = 50,
    pageIndex: number = 1,
    filters: string = ''
  ): Promise<any> {
    // add safe, encoded search parameter if term present
    const params = {
      sort: sortField,
      sortOrder: sortOrder,
      limit: pageSize * 1, // convert to number
      page: pageIndex * 1, // convert to number
      filters: filters,
    };

    try {
      const result: {
        docs: any;
        totalDocs: number;
      } = await this.callFunction('Users_getPaginated', [params]);

      // Convert results to User objects
      result.docs = User.fromJson(result.docs);

      this.log('fetched users');

      return result;
    } catch (error) {
      throw error;
      return this.handleError('getUsers', error);
    }
  }

  /** GET user by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number | string): Observable<any> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<any[]>(url).pipe(
      map((users) => users[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} user id=${id}`);
      }),
      catchError(this.handleError<any>(`getUser id=${id}`))
    );
  }

  /**
   * GET user by part.
   */
  getUsersByPart(part: any): Observable<any[]> {
    const partId = part._id;

    return this.http.get<any[]>(this.usersUrl).pipe(
      map((result: any[]) => {
        // searching on client side,
        // TODO REMOVE when doing nice requests on MongoDB
        return result.filter(
          (user) =>
            user.parts.find((availablePart) => availablePart._id === partId) !==
            undefined
        );
      }),
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} users assigned to part ${part.name}`);
      }),
      catchError(this.handleError('getUsersByPart', []))
    );
  }

  /**
   * Get the list of users which have the right to do the
   * 'weekend.publicTalk.chairman' part
   * nb: Sort assignments by week desc
   */
  getWeekendAssignableList(): Observable<any> {
    return this.http.get<any[]>(this.usersUrl + '/meeting/weekend').pipe(
      map((result) => {
        // Arranging
        const chairmanResults = result.find(
          (part) => part._id === 'weekend.publicTalk.chairman'
        );
        const speakerResults = result.find(
          (part) => part._id === 'weekend.publicTalk.speaker'
        );
        const conductorResults = result.find(
          (part) => part._id === 'weekend.watchtower.conductor'
        );
        const readerResults = result.find(
          (part) => part._id === 'weekend.watchtower.reader'
        );

        const weekeendAssignableList = {
          chairman:
            chairmanResults !== undefined
              ? chairmanResults.assignableUsers
              : null,
          speaker:
            speakerResults !== undefined
              ? speakerResults.assignableUsers
              : null,
          conductor:
            conductorResults !== undefined
              ? conductorResults.assignableUsers
              : null,
          reader:
            readerResults !== undefined ? readerResults.assignableUsers : null,
        };

        return weekeendAssignableList;
      }),
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} users assigned to weekend parts`);
      }),
      catchError(this.handleError('getWeekendAssignableList', []))
    );
  }

  /**
   * Get the list of users which have the right to do the
   * 'weekend.publicTalk.chairman' part
   * nb: Sort assignments by week desc
   */
  getMidweekStudentsAssignableList(): Observable<any> {
    return this.http
      .get<any[]>(this.usersUrl + '/meeting/midweek-students')
      .pipe(
        map((assignableUsers) => {
          // Arranging by part,

          const assignableUsersByPart = this._arrangeAssignableUsers(
            assignableUsers
          );

          return {
            list: assignableUsers,
            byPart: assignableUsersByPart,
          };
        }),
        tap((h) => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} users assigned to midweek students parts`);
        }),
        catchError(this.handleError('getMidweekStudentsAssignableList', []))
      );
  }

  /**
   * Extract the parts from the results from DB
   */
  _arrangeAssignableUsers(result: Array<any>): Array<any> {
    const assignableUsersByPartArranged = [];

    assignableUsersByPartArranged['bibleReading'] = result.filter(
      (user) =>
        user.parts.find(
          (part) => part.name === 'clm.treasures.bible-reading'
        ) !== undefined
    );
    assignableUsersByPartArranged['initialCall'] = result.filter(
      (user) =>
        user.parts.find((part) => part.name === 'clm.ministry.initial-call') !==
        undefined
    );
    assignableUsersByPartArranged['firstReturnVisit'] = result.filter(
      (user) =>
        user.parts.find(
          (part) => part.name === 'clm.ministry.first-return-visit'
        ) !== undefined
    );
    assignableUsersByPartArranged['secondReturnVisit'] = result.filter(
      (user) =>
        user.parts.find(
          (part) => part.name === 'clm.ministry.second-return-visit'
        ) !== undefined
    );
    assignableUsersByPartArranged['bibleStudy'] = result.filter(
      (user) =>
        user.parts.find((part) => part.name === 'clm.ministry.bible-study') !==
        undefined
    );
    assignableUsersByPartArranged['studentTalk'] = result.filter(
      (user) =>
        user.parts.find((part) => part.name === 'clm.ministry.talk') !==
        undefined
    );
    assignableUsersByPartArranged['studentAssistant'] = result.filter(
      (user) =>
        user.parts.find((part) => part.name === 'clm.ministry.assistant') !==
        undefined
    );

    return assignableUsersByPartArranged;
  }

  /**
   * Get/create a user
   *
   * @param id: string
   */
  async getUser(id: number | string, populate: boolean = false): Promise<any> {
    try {
      if (id) {
        // Fetch user from db
        this.log(`fetched user id=${id}`);

        return await this.stitchService.callFunction('Users_getById', [
          { $oid: id }, // Convert the string id to a MongoDb ObjectId
          populate,
        ]);
      } else {
        // create an empty user with default values
        return new User({
          // firstName: '',
          // lastName: '',
          ownerId: this.authService.getUser().id,
          // genre: '',
          child: false,
          baptized: false,
          publisher: false,
          disabled: false,
          parts: [],
        });
      }
    } catch (error) {
      catchError(this.handleError<any>(`getUser id=${id}`));
    }
  }

  /* GET users whose name contains search term */
  async searchUsers(term: string): Promise<User[]> {
    // term = term ? encodeURIComponent(term.trim()) : null;

    try {
      const result = await this.stitchService.callFunction('Users_search', [
        term,
      ]);

      const users = User.fromJson(result) as User[];

      this.log(`found users matching "${term}"`);

      return users;
    } catch (error) {
      this.handleError<any>('searchUsers', []);
    }
  }

  //////// Save methods //////////

  /**
   * @POST add a new user to the server
   */
  async addUser(user: User): Promise<any> {
    try {
      const result = await this.stitchService.callFunction('Users_insertMany', [
        [user],
      ]);
      user._id = result.insertedIds[0];
      // const insertedUser = User.fromJson(result.insertedIds[0]) as User;

      this.log(`added user w/ name=${user.fullName}`);
    } catch (error) {
      this.handleError<any>('addUser');
    }
  }

  /**
   * @PUT: update the user on the server
   */
  async updateUser(user: User): Promise<any> {
    try {
      const result = await this.stitchService.callFunction('Users_update', [
        user,
      ]);
      const updatedUser = User.fromJson(result.updatedData) as User;

      this.log(`updated user w/ name=${updatedUser.fullName}`);
    } catch (error) {
      catchError(this.handleError<any>('updateUser'));
    }
  }

  /** DELETE: delete the user from the server */
  async deleteUser(userId: string[]): Promise<any> {
    try {
      await this.stitchService.callFunction('Users_deleteByIds', [userId]);

      this.log(`deleted user`);
    } catch (error) {
      catchError(this.handleError<any>('deleteUser'));
    }
  }

  /** SOFT DELETE: mark the users as deleted from the server */
  async softDeleteUsers(userId: string[]): Promise<any> {
    try {
      const deleteProps = {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: this.authService.getUser().id,
      };

      await this.stitchService.callFunction('Users_updateByIds', [
        userId,
        deleteProps,
      ]);

      this.log(`deleted user`);
    } catch (error) {
      catchError(this.handleError<any>('deleteUser'));
    }
  }

  /**
   * Insert user if not existent, update it otherwise
   * @param user any model object
   */
  upsertUser(user: User) {
    // : Observable<any> {
    if (user._id !== null) {
      // user update
      return this.updateUser(user);
    } else {
      // user add
      delete user._id; // Important to get the generated _id from DB
      return this.addUser(user);
    }
  }
}
