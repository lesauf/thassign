import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { CommonService } from '@src/app/core/services/common.service';
import { generateUsers } from '@src/app/core/mocks/users.mock';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
import { User } from '@src/app/core/models/user/user.model';
import { Part } from '@src/app/core/models/part/part.model';
import { UserConverter } from '@src/app/core/models/user/user.converter';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { BackendService } from '@src/app/core/services/backend.service';
import { IsArray } from 'class-validator';

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
  /**
   * Current user to edit or view
   * Used to pass it as a parameter and avoid query again from the DB
   */
  private cUser: User;

  /**
   * Paginated user list store
   */
  private pUsersStore: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );

  /**
   * Paginated user list observable
   */
  pUsers: Observable<User[]> = this.pUsersStore.asObservable();

  /**
   * Pagination properties
   */
  sortField = 'lastName';
  sortOrder = 'asc';
  pageSize = 10;
  pageIndex = 1;
  searchTerm = '';

  /**
   * List of filters on the form filterName => dbField | type of dbField
   */
  filters = {};

  protected collectionName = 'users';
  protected serviceName = 'UserService';

  constructor(
    private http: HttpClient,
    protected messageService: MessageService,
    private partService: PartService,
    private translate: TranslateService,
    protected backendService: BackendService
  ) {
    super();

    // this.users = this.store.asObservable();

    // this.fetchUsers();

    // this.backendService.listenToCollection('users').subscribe((data) => {
    //   this.updateStore(this.createUser(data, partService.allParts) as User[]);
    // });
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

  destroy() {
    this.pUsersStore.complete();
    this.dataStore.complete();
  }

  /**
   * Create User instances from JSON or array of JSON objects
   *
   * @param userProperties JSON object/array with properties
   */
  createUser(
    userProperties: object,
    allParts?: Part[],
    allAssignments?: Assignment[]
  ): User | User[] {
    if (userProperties instanceof Array) {
      return userProperties.map(
        (obj) => new User(obj, allParts, allAssignments)
      ) as User[];
    } else {
      return new User(userProperties, allParts, allAssignments) as User;
    }
  }

  async generateUsers(numberToGenerate: number = 50, allParts: Part[]) {
    const parts = this.partService.getParts();
    const generatedUsers = generateUsers(
      parts,
      this.backendService.getSignedInUser()._id,
      numberToGenerate
    );

    try {
      // Clear the list of users to activate loader
      this.updateStore(null);

      // insert users
      await this.backendService.upsertManyDocs(
        'users',
        new UserConverter(),
        generatedUsers,
        'set'
      );

      // this.updateStore(this.createUser(users, allParts) as User[]);

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
  storeUsers(
    users: any[],
    allParts: Part[],
    allAssignments: Assignment[]
  ): User[] {
    try {
      // convert to User objects
      const allUsers = this.createUser(
        
        users,
      
         allParts,
      
         allAssignments
      
      ) as User[];
      // console.log('Users to put in the store :', allUsers);

      this.updateStore(allUsers);
      this.log('Stored users');

      return allUsers;
    } catch (error) {
      this.handleError('storeUsers', error, [], '');
    }
  }

  /**
   * Fetch a user by id from the backend
   * @param userId
   */
  async getUserFromDb(userId: string): Promise<User | null> {
    const doc = await this.backendService
      .getCollectionWithConverter('users', new UserConverter())
      .doc(userId)
      .get();

    return doc.exists ? (doc.data() as User) : null;
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

        return this.getUsers().find((user) => user._id === userId);
      } else {
        // create an empty user with default values
        return new User({
          // firstName: '',
          // lastName: '',
          ownerId: this.backendService.getSignedInUser()._id,
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
  // async searchUsers(term: string): Promise<User[]> {
  //   // term = term ? encodeURIComponent(term.trim()) : null;

  //   try {
  //     const result = await this.callFunction('Users_search', [term]);

  //     // const users = this.createUser(result) as User[];
  //     const users = result;
  //     this.log(`found users matching "${term}"`);

  //     return users;
  //   } catch (error) {
  //     this.handleError<any>('searchUsers', []);
  //   }
  // }

  /**
   * Check if a given user pass the filters
   */
  filterUser(user: User): boolean {
    let passFiltering = true; // Do this user pass all the filters ?

    // Loop on the filters keys
    Object.keys(this.filters).forEach((fKey) => {
      if (this.filters[fKey] === 'boolean') {
        // pass if field value is true
        passFiltering = passFiltering && user[fKey] === true;
      } else if (this.filters[fKey] === 'boolean-false') {
        // pass if field value is false
        passFiltering = passFiltering && user[fKey] === false;
      } else {
        // filter key is the value, filter value is the name of the field
        const fValue = this.filters[fKey];
        passFiltering = passFiltering && user[fValue] === fKey;
      }
    });

    return passFiltering;
  }

  sortUsers(a: User, b: User): number {
    if (a[this.sortField] === b[this.sortField]) {
      return 0;
    }

    const sortResult = a[this.sortField] > b[this.sortField] ? 1 : -1;

    return this.sortOrder === 'asc' ? sortResult : -sortResult;
  }

  /**
   * Paginate users
   *
   * @returns the total number of filtered users for pagination
   */
  paginateUsers(): number {
    const users = this.dataStore.getValue();

    if (users !== null) {
      const fUsers = users.filter(
        (user) =>
          user.fullName.match(new RegExp(this.searchTerm, 'i')) !== null &&
          this.filterUser(user)
      );

      this.pUsersStore.next(
        fUsers
          .sort((a: User, b: User) => this.sortUsers(a, b))
          .slice(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize
          )
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
  getUsersByPart(part: Part): User[] {
    const users = this.getUsers();

    return users.filter(
      (user) =>
        (user.parts as Part[]).find(
          (assignablePart) => assignablePart.name === part.name
        ) !== undefined
    );
    //   tap((h) => {
    //     const outcome = h ? `fetched` : `did not find`;
    //     this.log(`${outcome} users assigned to part ${part.name}`);
    //   })
    //   // catchError(this.handleError('getUsersByPart', []))
    // );
  }

  /**
   * Get the list of users which have the right to do the
   * 'weekend.publicTalk.chairman' part
   * nb: Sort assignments by week desc
   */
  // getWeekendAssignableList(): Observable<any> {
  //   return this.http.get<any[]>(this.usersUrl + '/meeting/weekend').pipe(
  //     map((result) => {
  //       // Arranging
  //       const chairmanResults = result.find(
  //         (part) => part.name === 'weekend.publicTalk.chairman'
  //       );
  //       const speakerResults = result.find(
  //         (part) => part.name === 'weekend.publicTalk.speaker'
  //       );
  //       const conductorResults = result.find(
  //         (part) => part.name === 'weekend.watchtower.conductor'
  //       );
  //       const readerResults = result.find(
  //         (part) => part.name === 'weekend.watchtower.reader'
  //       );

  //       const weekeendAssignableList = {
  //         chairman:
  //           chairmanResults !== undefined
  //             ? chairmanResults.assignableUsers
  //             : null,
  //         speaker:
  //           speakerResults !== undefined
  //             ? speakerResults.assignableUsers
  //             : null,
  //         conductor:
  //           conductorResults !== undefined
  //             ? conductorResults.assignableUsers
  //             : null,
  //         reader:
  //           readerResults !== undefined ? readerResults.assignableUsers : null,
  //       };

  //       return weekeendAssignableList;
  //     }),
  //     tap((h) => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       this.log(`${outcome} users assigned to weekend parts`);
  //     })
  //     // catchError(this.handleError('getWeekendAssignableList', []))
  //   );
  // }

  /**
   * Get the list of users which have the right to do the
   * 'weekend.publicTalk.chairman' part
   * nb: Sort assignments by week desc
   */
  getAssignableUsersByParts(parts: Part[], meetingName: string): any {
    const users = this.getUsers();

    const assignableUsersByPart = {};

    const assignableUsers = users.filter((user) => {
      const meetings = user.meetingsAssignable;
      return meetings.includes(meetingName) && !user.disabled;
    });

    // Arranging by part,
    parts.forEach((part) => {
      assignableUsersByPart[part.name] = assignableUsers.filter(
        (user) =>
          (user.parts as Part[]).find(
            (userPart) => userPart.name === part.name
          ) !== undefined
      );
    });

    // console.log(assignableUsersByPart);
    // assignableUsersByPart = this._arrangeAssignableUsers(assignableUsersByPart);
    return {
      list: assignableUsers,
      byPart: assignableUsersByPart,
    };
  }

  /**
   * Rename the parts for better lisibility
   */
  // _arrangeAssignableUsers(result: {}): AssignableUsersByPart {
  //   return {
  //     bibleReading: result['clm.treasures.bible-reading'],
  //     initialCall: result['clm.ministry.initial-call'],
  //     firstReturnVisit: result['clm.ministry.first-return-visit'],
  //     secondReturnVisit: result['clm.ministry.second-return-visit'],
  //     bibleStudy: result['clm.ministry.bible-study'],
  //     studentTalk: result['clm.ministry.talk'],
  //     studentAssistant: result['clm.ministry.assistant'],
  //   } as AssignableUsersByPart;
  // }

  //////// Save methods //////////

  /**
   * Add a new user to the server
   */
  async addUser(user: User, allParts?: Part[]): Promise<any> {
    try {
      await this.backendService.upsertOneDoc(
        'users',
        new UserConverter(),
        user
      );

      this.log(`added user`);
    } catch (error) {
      this.handleError<any>('addUser', error);
    }
  }

  /**
   * @PUT: update the user on the server
   */
  async updateUser(user: User, allParts?: Part[]): Promise<void> {
    try {
      await this.backendService.upsertOneDoc(
        'users',
        new UserConverter(),
        user,
        user._id,
        'set',
        true
      );

      this.log(`updated user`);
    } catch (error) {
      this.handleError<any>('updateUser', error);
    }
  }

  /**
   * DELETE: delete the user from the server
   */
  async deleteUser(userId: string | string[]): Promise<any> {
    try {
      if (userId.hasOwnProperty('length')) {
        // many users
        await this.backendService.upsertManyDocs(
          'users',
          new UserConverter(),
          userId as String[],
          'delete'
        );

        this.log(`deleted users`);
      } else {
        // Only one user
        await this.backendService.upsertOneDoc(
          'users',
          new UserConverter(),
          null,
          userId as string,
          'delete'
        );

        this.log(`deleted user`);
      }
      // const users = await this.callFunction('Users_deleteByIds', [userId]);

      //   this.updateStore(this.createUser(users, allParts) as User[]);
    } catch (error) {
      this.handleError<any>('deleteUser', error);
    }
  }

  /**
   * Insert user if not existent, update it otherwise
   * @param user any model object
   */
  upsertUser(user: User, allParts: Part[]) {
    // : Observable<any> {
    user.prepareToSave();

    // this.parts = (this.parts as Part[]).map((part) => part.name);

    if (user._id !== null) {
      // user update
      return this.updateUser(user, allParts);
    } else {
      // user add
      delete user._id; // Important to get the generated _id from DB
      return this.addUser(user, allParts);
    }
  }
}
