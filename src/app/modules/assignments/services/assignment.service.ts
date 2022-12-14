import { HttpHeaders } from '@angular/common/http';
import { Injectable, ɵConsole } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DateTime, Interval } from 'luxon';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { CommonService } from '@src/app/core/services/common.service';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
import { SettingService } from '@src/app/core/services/setting.service';
import { UserService } from '@src/app/modules/users/user.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';
import { AssignmentConverter } from '@src/app/core/models/assignment/assignment.converter';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  reportProgress: true,
};

/**
 * Get data about assignments from storage
 */
@Injectable({
  providedIn: 'root',
})
export abstract class AssignmentService extends CommonService<Assignment> {
  // public abstract weekendParts = [
  //   'weekend.publicTalk.chairman',
  //   'weekend.publicTalk.speaker',
  //   'weekend.watchtower.conductor',
  //   'weekend.watchtower.reader',
  // ];

  // private assignmentsUrl = 'api/assignment'; // URL to web api

  /**
   * Filtered assignments store
   */
  private pAssignmentsStore: BehaviorSubject<
    Assignment[]
  > = new BehaviorSubject<Assignment[]>([]);

  /**
   * Paginated user list observable
   */
  pAssignments: Observable<
    Assignment[]
  > = this.pAssignmentsStore.asObservable();

  /**
   * All the assignments separated by users
   * userId => Assignment[]
   */
  assignmentsByUser: Map<string, Assignment[]> = new Map();

  /**
   * Display the Students part ?
   * if undefined display all parts
   *
   * This is used for a session. The one in SettingService
   * is persisted in the DB
   */
  displayStudentsParts: boolean;

  constructor(
    private authService: AuthService,
    protected backendService: BackendService,
    protected messageService: MessageService,
    protected partService: PartService,
    protected settingService: SettingService,
    protected userService: UserService
  ) {
    super();

    // Get some settings
    this.displayStudentsParts = this.settingService.displayStudentsParts;

    // generateAssignments(userService, partSer);
  }

  destroy() {
    this.pAssignmentsStore.complete();
    this.dataStore.complete();
  }

  /**
   * Create Assignment instances from JSON or array of JSON objects
   *
   * @param props JSON object/array with properties
   */
  createAssignment(
    props: object,
    allParts?: Part[],
    allUsers?: User[]
  ): Assignment | Assignment[] {
    if (props instanceof Array) {
      const assignments = props.map((obj, index) => {
        return new Assignment(obj, allParts, allUsers);
      }) as Assignment[];

      return assignments;
    } else {
      return new Assignment(props) as Assignment;
    }
  }

  /**
   * Populate assignmentsByUser
   * Sorted by week ( and position ?)
   * @param allAssignments
   */
  groupAssignmentsByUser(allAssignments?: Map<string, Assignment>, users?: User[]) {
    if (allAssignments === undefined) {
      allAssignments = this.getAssignments();
    }

    if (users === undefined) {
      users = this.userService.getUsers();
    }
    users.forEach((user) => {
      // Convert the Map assignments to an array to make the search
      const assMap = [...allAssignments.values()];
      let userAss = assMap.filter((ass: Assignment) => {
        const isAssignee = ass.assignee?._id === user._id;
        const isAssistant = ass.assistant?._id === user._id;
        // Assignee or assistant
        return isAssignee || isAssistant;
      });

      this.assignmentsByUser.set(user._id, userAss);
    });
  }

  generateAssignments(
    meeting: string,
    month: DateTime,
    listOfParts: object,
    assignableUsersByPart: object
  ) {
    const assignments: Assignment[] = [];
    const weeks = this.getAllWeeksOfTheSelectedMonth(month);
    const listOfPartsByWeek = this.getListOfPartsByWeek(meeting, month);
    // console.log(weeks);
    weeks.forEach((week, index) => {
      let position = 1;
      // TODO fetch from the db, from the epub

      listOfPartsByWeek[index].forEach((partName) => {
        // Set the position for repetitive parts

        const previous = assignments.slice(-1)[0];

        if (previous?.part.name === listOfParts[partName].name) {
          position = previous.position + 1;
        }

        assignments.push(
          new Assignment({
            week: week.start.toJSDate(),
            part: listOfParts[partName],
            assignee: {},
            position: position,
            assignableUsers: assignableUsersByPart[partName],
            // https://stackoverflow.com/a/40560953
            ...(listOfParts[partName]['withAssistant'] && {
              assistant: {},
            }),
            ...(listOfParts[partName]['withTitle'] && { title: '' }),
            ...(listOfParts[partName]['withAssistant'] && {
              assignableAssistants: assignableUsersByPart['studentAssistant'],
            }),
          })
        );
      });
    });

    return assignments;
  }

  /**
   * Get assignments from store
   */
  getAssignments(): Map<string, Assignment> {
    return this.dataStore.getValue();
  }

  /**
   * Get all assignments from the server
   */
  storeAssignments(
    assignments: Map<string, Assignment>,
    allParts?: Part[],
    allUsers?: User[]
  ) {
    try {
      this.updateStore(assignments);
      // this.log('fetched Assignments', 'AssignmentService');

      // return allAssignments;
    } catch (error) {
      return this.handleError('storeAssignments', error, [], '');
    }
  }

  /**
   * Get the assignments for some parts during a month
   * Update the pAssignments observable
   * @param month Luxon DateTime first day of the desired month
   * @param listOfParts Part[] List of parts we want to get the assignments on
   */
  getAssignmentsByPartsAndMonth(
    month: DateTime,
    listOfParts: Part[],
    assignments?: Assignment[]
  ): Assignment[] {
    if (assignments === undefined) {
      const assMap = this.getAssignments();
      assignments = [...assMap.values()];
    }

    let pAssignments: Assignment[];
    if (assignments !== null) {
      pAssignments = assignments.filter((assignment) => {
        const isForMeeting =
          listOfParts.find((part) => part.name === assignment.part.name) !==
          undefined;

        const isForMonth = month.get('month') === assignment.week.get('month');

        return isForMeeting && isForMonth;
      });

      pAssignments = pAssignments.sort(
        (a, b) => a.part.position - b.part.position
      );
      // console.log('PASS', pAssignments);

      this.pAssignmentsStore.next(pAssignments);
    } else {
      this.pAssignmentsStore.next([]);
    }

    return pAssignments;
  }

  /**
   * Check if the current user is handling the given part
   * @param part
   */
  isWorkingOnPart(part: Part): boolean {
    const isStudentPart = this.partService.meetingParts[
      'midweek-students'
    ].includes(part.name);
    
    if (this.displayStudentsParts === true) {
      // Only display students parts
      return isStudentPart;
    } else if (this.displayStudentsParts === false) {
      // Only display non students parts
      return !isStudentPart;
    } else {
      // Display all the parts
      return true;
    }
  }

  //////// Save methods //////////
  /**
   * @POST add a new assignment to the server
   */
  async addAssignment(assignment: Assignment): Promise<any> {
    try {
      await this.backendService.upsertOneDoc(
        'assignments',
        assignment,
        null,
        'set',
        false,
        new AssignmentConverter()
      );

      this.log(`added assignment`);
    } catch (error) {
      this.handleError<any>('addAssignment', error);
    }
  }

  /**
   * @PUT: update the assignment on the server
   */
  async updateAssignment(assignment: Assignment): Promise<void> {
    try {
      await this.backendService.upsertOneDoc(
        'assignments',
        assignment,
        assignment._id,
        'set',
        true,
        new AssignmentConverter()
      );

      this.log(`updated assignment`);
    } catch (error) {
      this.handleError<any>('updateAssignment', error);
    }
  }

  /**
   * DELETE: delete the assignment from the server
   */
  async deleteAssignment(assignmentId: string | string[]): Promise<any> {
    try {
      if (assignmentId.hasOwnProperty('length')) {
        // many assignments
        await this.backendService.upsertManyDocs(
          'assignments',
          assignmentId as String[],
          'delete',
          false,
          new AssignmentConverter()
        );

        this.log(`deleted assignments`);
      } else {
        // Only one assignment
        await this.backendService.upsertOneDoc(
          'users',
          null,
          assignmentId as string,
          'delete',
          false,
          new AssignmentConverter()
        );

        this.log(`deleted assignment`);
      }
    } catch (error) {
      this.handleError<any>('deleteAssignment', error);
    }
  }

  /**
   * Insert assignment if not existent, update it otherwise
   * @param assignments Assignment list
   */
  async saveAssignments(
    assignments: Assignment[],
    startDate: DateTime,
    allParts: Part[],
    allUsers: User[]
  ): Promise<void> {
    const endDate = startDate.set({ day: startDate.daysInMonth });

    const toSave = [];
    // convert User, assignee and Part to their _id
    assignments.forEach((ass, i) => {
      ass.prepareToSave();

      toSave[i] = {};
      Object.assign(toSave[i], ass);
      toSave[i].week = ass.week.toISO();
      toSave[i].part = ass.part.name;
      toSave[i].assignee = ass.assignee?._id;
      if (ass.assistant) {
        toSave[i].assistant = ass.assistant?._id;
      }
    });

    try {
      // First delete all the assignments for the given period
      const assToDelete = await this.backendService.getDocsInRange(
        'assignments',
        'week',
        startDate.toISODate(),
        endDate.toISODate()
      );
      if (assToDelete.length) {
        this.backendService.upsertManyDocs(
          'assignments',
          assToDelete,
          'delete',
          false,
          new AssignmentConverter()
        );
      }

      // Then insert the new ones
      await this.backendService.upsertManyDocs(
        'assignments',
        toSave,
        'set',
        false,
        new AssignmentConverter()
      );

      //  Save the assignments and fetch all of them from the DB
      // const result = await this.callFunction('Assignments_insertMany', [
      //   startDate.toISO(),
      //   endDate.toISO(),
      //   toSave,
      // ]);

      // Then update Store
      // this.updateStore(
      //   this.createAssignment(result, allParts, allUsers) as Assignment[]
      // );
    } catch (error) {
      this.handleError<any>('saveAssignments', error);
    }
  }

  // saveWeekendAssignments(weekendAssignments: Array<any>) {
  //   this.upsertAssignment(weekendAssignments['chairman']);
  //   this.upsertAssignment(weekendAssignments['speaker']);
  //   this.upsertAssignment(weekendAssignments['conductor']);
  //   this.upsertAssignment(weekendAssignments['reader']);
  // }

  // Date functions to move to another service
  getFirstWeekOfTheSelectedMonth(month: DateTime) {
    const firstMondayOfMonth =
      month.weekday === 1 ? month : month.set({ weekday: 8 }); // set the date as the first monday of the month
    const endTime = firstMondayOfMonth.plus({ days: 6 });

    return Interval.fromDateTimes(firstMondayOfMonth, endTime);

    // if (this.month.weekday !== this.settingService.getStartDayOfWeek()) {
    //   this.firstWeekOfTheMonth = this.month
    //     .plus({ week: 1 })
    //     .set({ weekday: this.settingService.getStartDayOfWeek() });
    // } else {
    //   this.firstWeekOfTheMonth = this.month;
    // }
  }

  /**
   * Get an array of all the weeks in the selected month
   */
  getAllWeeksOfTheSelectedMonth(month: DateTime): Interval[] {
    const weeks = [];
    const nextMonth = month.plus({ month: 1 });

    for (
      let currentWeek = this.getFirstWeekOfTheSelectedMonth(month);
      currentWeek.start < nextMonth;
      currentWeek = currentWeek.set({
        // we shift to the next week
        start: currentWeek.start.plus({ week: 1 }),
        end: currentWeek.end.plus({ week: 1 }),
      })
    ) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  /**
   * TODO Fetch them either from the epub or from jw.org.
   * Read the contract of jw.org
   */
  getListOfPartsByWeek(meeting, month) {
    const listOfPartsByWeek = [
      ['bibleReading', 'studentTalk'],
      ['bibleReading', 'initialCall', 'initialCall', 'initialCall'],
      ['bibleReading', 'firstReturnVisit', 'firstReturnVisit'],
      ['bibleReading', 'secondReturnVisit', 'bibleStudy'],
      ['bibleReading', 'secondReturnVisit', 'bibleStudy', 'bibleStudy'],
    ];

    return listOfPartsByWeek;
  }
}
