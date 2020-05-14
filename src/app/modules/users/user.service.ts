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

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

interface AssignableUsersByPart {
  bibleReading: User[];
  initialCall: User[];
  firstReturnVisit: User[];
  secondReturnVisit: User[];
  bibleStudy: User[];
  studentTalk: User[];
  studentAssistant: User[];
}
/**
 * Observable Data Service
 * @see https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
 * Get data about users from storage
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends CommonService<User> {
  private usersUrl = 'api/user'; // URL to web api

  /**
   * Current user to edit or view
   * Used to pass it as a parameter and avoid query again from the DB
   */
  private cUser: User;

  /**
   * Paginated user list store
   */
  private pUsersStore: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    null
  );

  /**
   * Paginated user list observable
   */
  pUsers: Observable<User[]> = this.pUsersStore.asObservable();

  sortField = 'lastName';
  sortOrder = 'ASC';
  pageSize = 10;
  pageIndex = 1;

  protected collectionName = 'users';
  protected serviceName = 'UserService';

  constructor(
    private http: HttpClient,
    protected messageService: MessageService,
    private partService: PartService,
    private authService: AuthService,
    private translate: TranslateService,
    protected backendService: StitchService
  ) {
    super();

    // this.users = this.store.asObservable();

    this.fetchUsers();
  }

  /**
   * Return the saved user and clear the state
   */
  get currentUser(): User {
    const s = this.cUser;
    this.cUser = null;

    return s;
  }

  /**
   * Set the saved user
   */
  set currentUser(user: User) {
    this.cUser = user;
  }

  async generateUsers(numberToGenerate: number = 50) {
    const parts = await this.partService.getParts();
    const generatedUsers = generateUsers(
      parts,
      this.authService.getUser().id,
      numberToGenerate
    );

    try {
      // Clear the list of users to activate loader
      this.updateStore(null);

      const users = await this.callFunction('Users_insertMany', [
        generatedUsers,
      ]);

      this.updateStore(User.fromJson(users) as User[]);

      this.log('generated users');
    } catch (error) {
      this.handleError('generateUsers', error);
    }
  }

  public testOs() {
    const user = new User({ firstName: 'usersdf', lastName: 'rasen' });
    this.dataStore.getValue().push(user);
  }

  /**
   * Get users from store
   */
  getUsers(): User[] {
    return this.dataStore.getValue();
  }

  /**
   * Get all users from server
   */
  async fetchUsers(): Promise<User[]> {
    try {
      let result = await this.callFunction('Users_find');

      // Convert results to User objects
      result = User.fromJson(result) as User[];

      this.updateStore(result);
      this.log('fetched users');

      return result;
    } catch (error) {
      return this.handleError('fetchUsers', error, [], '');
    }
  }

  /**
   * Get/create a user
   *
   * @param id: string
   */
  getUser(userId: string = null): User {
    try {
      if (userId) {
        // Get user from store
        this.log(`fetched user id=${userId}`);

        return this.getUsers().find(
          (user) => user._id.toHexString() === userId
        );
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
          deleted: false,
          parts: [],
        });
      }
    } catch (error) {
      this.handleError<any>(`getUser id=${userId}`, error);
    }
  }

  /* GET users whose name contains search term */
  async searchUsers(term: string): Promise<User[]> {
    // term = term ? encodeURIComponent(term.trim()) : null;

    try {
      const result = await this.callFunction('Users_search', [term]);

      const users = User.fromJson(result) as User[];

      this.log(`found users matching "${term}"`);

      return users;
    } catch (error) {
      this.handleError<any>('searchUsers', []);
    }
  }

  /**
   * Query users from the server
   * rename to Paginate users
   *
   * @returns the total number of filtered users for pagination
   */
  paginateUsers(
    sortField: string = 'lastName',
    sortOrder: string = 'asc',
    pageSize: number = 50,
    pageIndex: number = 1,
    filters: string = ''
  ): number {
    function filterFunction(user: User) {
      return user.fullName.match(new RegExp(filters, 'i')) !== null;
    }

    function sortFunction(a: User, b: User): number {
      if (a[sortField] === b[sortField]) {
        return 0;
      }

      const sortResult = a[sortField] > b[sortField] ? 1 : -1;

      return sortOrder === 'asc' ? sortResult : -sortResult;
      // return a[sortField] >
      //   b[sortField]
      //   ? 1
      //   : -1;
    }

    const users = this.dataStore.getValue();

    if (users !== null) {
      const fUsers = users.filter((user) => filterFunction(user));

      this.pUsersStore.next(
        fUsers
          .sort((a: User, b: User) => sortFunction(a, b))
          .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      );

      return fUsers.length;
    } else {
      this.pUsersStore.next(null);

      return 0;
    }
  }

  /**
   * GET user by part.
   */
  // getUsersByPart(part: any): Observable<any[]> {
  //   const partId = part._id;

  //   return this.http.get<any[]>(this.usersUrl).pipe(
  //     map((result: any[]) => {
  //       // searching on client side,
  //       // TODO REMOVE when doing nice requests on MongoDB
  //       return result.filter(
  //         (user) =>
  //           user.parts.find((availablePart) => availablePart._id === partId) !==
  //           undefined
  //       );
  //     }),
  //     tap((h) => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       this.log(`${outcome} users assigned to part ${part.name}`);
  //     })
  //     // catchError(this.handleError('getUsersByPart', []))
  //   );
  // }

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
      })
      // catchError(this.handleError('getWeekendAssignableList', []))
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
        })
        // catchError(this.handleError('getMidweekStudentsAssignableList', []))
      );
  }

  /**
   * Extract the parts from the results from DB
   */
  _arrangeAssignableUsers(result: Array<any>): AssignableUsersByPart {
    return {
      bibleReading: result.filter(
        (user) =>
          user.parts.find(
            (part) => part.name === 'clm.treasures.bible-reading'
          ) !== undefined
      ),
      initialCall: result.filter(
        (user) =>
          user.parts.find(
            (part) => part.name === 'clm.ministry.initial-call'
          ) !== undefined
      ),
      firstReturnVisit: result.filter(
        (user) =>
          user.parts.find(
            (part) => part.name === 'clm.ministry.first-return-visit'
          ) !== undefined
      ),
      secondReturnVisit: result.filter(
        (user) =>
          user.parts.find(
            (part) => part.name === 'clm.ministry.second-return-visit'
          ) !== undefined
      ),
      bibleStudy: result.filter(
        (user) =>
          user.parts.find(
            (part) => part.name === 'clm.ministry.bible-study'
          ) !== undefined
      ),
      studentTalk: result.filter(
        (user) =>
          user.parts.find((part) => part.name === 'clm.ministry.talk') !==
          undefined
      ),
      studentAssistant: result.filter(
        (user) =>
          user.parts.find((part) => part.name === 'clm.ministry.assistant') !==
          undefined
      ),
    } as AssignableUsersByPart;
  }

  //////// Save methods //////////

  /**
   * @POST add a new user to the server
   */
  async addUser(user: User): Promise<any> {
    try {
      const users = await this.callFunction('Users_insertMany', [[user]]);

      this.updateStore(User.fromJson(users) as User[]);

      this.log(`added user`);
    } catch (error) {
      this.handleError<any>('addUser', error);
    }
  }

  /**
   * @PUT: update the user on the server
   */
  async updateUser(user: User): Promise<void> {
    try {
      const users = await this.callFunction('Users_updateByIds', [
        [user._id],
        user,
      ]);

      this.updateStore(User.fromJson(users) as User[]);

      this.log(`updated user`);
    } catch (error) {
      this.handleError<any>('updateUser', error);
    }
  }

  /** DELETE: delete the user from the server */
  async deleteUser(userId: string[]): Promise<any> {
    try {
      const users = await this.callFunction('Users_deleteByIds', [userId]);

      this.updateStore(User.fromJson(users) as User[]);

      this.log(`deleted user`);
    } catch (error) {
      this.handleError<any>('deleteUser', error);
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

      const users = await this.callFunction('Users_updateByIds', [
        userId,
        deleteProps,
      ]);

      this.updateStore(User.fromJson(users) as User[]);

      this.log(`deleted user`);
    } catch (error) {
      this.handleError<any>('deleteUser', error);
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
