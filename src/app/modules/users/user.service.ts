import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CommonService } from '../../core/services/common.service';
import { MessageService } from '../../core/services/message.service';
import { StitchService } from 'src/app/core/services/stitch.service';
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
    // private partService: PartService,
    private translate: TranslateService,
    protected stitchService: StitchService
  ) {
    super('users', 'UserService', messageService, stitchService);
  }

  generateUsers(number: number = 50) {
    const userRequest = this.http.get<any>(
      this.usersUrl + '/generate/' + number
    );

    const usersList = userRequest.pipe(
      tap((_) => this.log('generated users')),
      catchError(this.handleError('generateUsers', []))
    );

    return usersList;
  }

  /**
   * Get all users from the server
   */
  getUsers(
    sort: string = 'lastName',
    sortOrder: string = 'ASC',
    pageSize: number = 50,
    pageIndex: number = 1,
    filters: string = ''
  ): Observable<any> {
    // add safe, encoded search parameter if term present
    const options = {
      params: new HttpParams()
        .set('sort', sort)
        .set('sortOrder', sortOrder)
        .set('limit', pageSize.toString())
        .set('page', pageIndex.toString())
        .set('filters', filters),
    };

    // TODO add to the query when doing server-side
    const userRequest = this.http.get<any>(
      this.usersUrl + '/paginated',
      options
    );
    const usersList = userRequest.pipe(
      tap((_) => this.log('fetched users')),
      // map((result: any[]) => {
      //   // sorting on client side,
      //   // TODO REMOVE when sorting on server side
      //   return result
      //     .sort((a: any, b: any) => {
      //       if (a[sort].toLowerCase() > b[sort].toLowerCase()) {
      //         return sortOrder === 'asc' ? 1 : -1;
      //       }

      //       if (a[sort].toLowerCase() < b[sort].toLowerCase()) {
      //         return sortOrder === 'asc' ? -1 : 1;
      //       }

      //       return 0;
      //     })
      //     .slice(pageSize * pageIndex, pageSize * pageIndex + pageSize); // TODO : Pagination, or maybe a client-side datagrid?
      // }),
      catchError(this.handleError('getUsers', []))
    );

    // const usersTotal = userRequest.pipe(
    //   map((result: any[]) => result.length)
    // );
    return usersList;
    // return {
    //   list: usersList
    //   // total: usersTotal
    // };
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
  getUser(id: number | string, populate: boolean = false): Observable<any> {
    if (id) {
      // Fetch user from db
      const url = `${this.usersUrl}/${id}?populate=${populate}`;
      return this.http.get<any>(url).pipe(
        tap((_) => this.log(`fetched user id=${id}`)),
        catchError(this.handleError<any>(`getUser id=${id}`))
      );
    } else {
      // create an empty user with default values // Gave me an error
      const user = {
        firstName: '',
        lastName: '',
        genre: '',
        child: false,
        baptized: false,
        publisher: false,
        disabled: false,
        parts: [],
      } as any;
      return new BehaviorSubject(user).asObservable();
    }
  }

  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<any[]> {
    term = term ? encodeURIComponent(term.trim()) : null;

    return this.http.get<any[]>(this.usersUrl + `/search/${term}`).pipe(
      tap((_) => this.log(`found users matching "${term}"`)),
      catchError(this.handleError<any[]>('searchUsers', []))
    );
  }

  //////// Save methods //////////

  /**
   * @POST add a new user to the server
   */
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, httpOptions).pipe(
      tap((result: any) => {
        const addedUser = result.insertedData;

        this.log(`added user w/ name=${addedUser.fullName}`);
      }),
      catchError(this.handleError<any>('addUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser(user: any): Observable<any> {
    const url = `${this.usersUrl}/${user._id}`;

    return this.http.put(url, user, httpOptions).pipe(
      tap((result: any) => {
        const updatedUser = result.updatedData;

        this.log(`updated user w/ name=${updatedUser.fullName}`);
      }),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(userId: string[]): Observable<any> {
    const url = `${this.usersUrl}/delete`;

    const options = {
      headers: httpOptions.headers,
      body: userId,
    };
    return this.http.delete(url, options).pipe(
      tap((_) => this.log(`deleted user`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  /**
   * Insert user if not existent, update it otherwise
   * @param user any model object
   */
  upsertUser(user: any) {
    // : Observable<any> {
    // Generate some fields (type and progress)
    switch (user.genre) {
      case 'man':
        if (user.child) {
          user.type = 'boy';
        } else if (user.overseer === 'elder') {
          user.type = 'elder';
        } else if (user.overseer === 'ministerial-servant') {
          user.type = 'ministerial-servant';
        } else {
          user.type = 'man';
        }
        break;
      default:
        user.type = user.child ? 'girl' : 'woman';
        break;
    }

    if (!user.publisher) {
      user.progress = 'not-publisher';
    } else {
      if (!user.baptized) {
        user.progress = 'unbaptized-publisher';
      }
    }

    // unbaptized, child and woman can not be overseer
    if (!user.baptized || user.child || user.genre === 'woman') {
      user.overseer = null;
    }

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
