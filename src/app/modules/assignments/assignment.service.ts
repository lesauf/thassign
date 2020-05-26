import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { DateTime, Interval } from 'luxon';

import { AuthService } from '../auth/auth.service';
import { CommonService } from '../../core/services/common.service';
import { MessageService } from '../../core/services/message.service';
import { PartService } from '../../core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from '../users/user.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';

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
  public abstract weekendParts = [
    'weekend.publicTalk.chairman',
    'weekend.publicTalk.speaker',
    'weekend.watchtower.conductor',
    'weekend.watchtower.reader',
  ];

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

  constructor(
    private http: HttpClient,
    protected messageService: MessageService,
    private partService: PartService,
    private authService: AuthService,
    private settingService: SettingService,
    private userService: UserService
  ) {
    super();

    // generateAssignments(userService, partSer);
  }

  /**
   * Get users from store
   */
  getAssignments(): Assignment[] {
    return this.dataStore.getValue();
  }

  /**
   * Get all users from the server
   */
  async fetchAssignments(): Promise<Assignment[]> {
    try {
      let result = await this.callFunction('Assignments_find');

      // Convert results to User objects
      result = Assignment.fromJson(result) as Assignment[];
      // Sort
      result.sort((a: Assignment, b: Assignment) => {
        // sort desc
        if (a.week > b.week) {
          return -1;
        }

        if (a.week < b.week) {
          return 1;
        }

        return 0;
      });

      this.updateStore(result);
      this.log('fetched Assignments');

      return result;
    } catch (error) {
      return this.handleError('fetchAssignments', error, [], '');
    }
  }

  /**
   * Get an assignment
   *
   * @param id: string
   */
  getAssignment(id?: number | string): Assignment {
    try {
      if (id) {
        // Get assignment from store
        this.log(`fetched assignment id=${id}`);

        return this.getAssignments().find(
          (assignment) => assignment._id.toHexString() === id
        );
      } else {
        // create an empty assignment with default values
        return new Assignment({
          ownerId: this.authService.getUser().id,
        });
      }
    } catch (error) {
      this.handleError<any>(`getAssignment id=${id}`, error);
    }
  }

  /**
   * Create User instances from JSON or array of JSON objects
   *
   * @param props JSON object/array with properties
   */
  createAssignment(props?: object): Assignment | Assignment[] {
    if (props instanceof Array) {
      return props.map((obj, index) => {
        // Set the assignment position as its position in the array
        obj.position = index;
        return new Assignment(obj);
      }) as Assignment[];
    } else {
      return new Assignment(props) as Assignment;
    }
  }

  /**
   * GET assignments by week
   * @param week as a DateTime object
   * @param partNames List of part we want to filter
   */
  // getAssignmentsByWeek(
  //   week: DateTime,
  //   partNames?: string[]
  // ): Observable<Assignment[]> {
  //   const url = this.assignmentsUrl + '/week/' + week.toFormat('YYYY-MM-DD');
  //   return this.http.get<Assignment[]>(url).pipe(
  //     tap((h) => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       const weekFormatted = week.toFormat('L');
  //       this.log(
  //         `${outcome} assignments of week ${weekFormatted}`,
  //         'AssignmentService'
  //       );
  //     }),
  //     catchError(this.handleError('getAssignmentsByWeek', []))
  //   );
  // }

  // async getWeekendAssignmentsByMonth(month: DateTime) {
  //   // console.log(week.toFormat('YYYY-MM-DD'));
  //   const url =
  //     this.assignmentsUrl +
  //     '/meeting/weekend/month/' +
  //     month.toFormat(this.settingService.getDateFormat('store'));

  //   // // Get all the assignments of this week
  //   const weekendAssignments = await this.http
  //     .get<any[]>(url)
  //     .pipe(
  //       tap((h) => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         const monthFormatted = month.toFormat('L');
  //         this.log(
  //           `${outcome} weekend assignments of month ${monthFormatted}`,
  //           'AssignmentService'
  //         );
  //       }),
  //       catchError(this.handleError('getWeekendAssignmentsByMonth', []))
  //     )
  //     .toPromise();
  //   // console.log(weekendAssignments);
  //   // Now group them by week then part name
  //   const weekendAssignmentsGrouped = [];
  //   weekendAssignments.forEach((week) => {
  //     weekendAssignmentsGrouped[week._id] = [];
  //     week.parts.forEach((result) => {
  //       weekendAssignmentsGrouped[week._id][result._id.part] =
  //         result.assignment;
  //     });
  //   });

  //   return weekendAssignmentsGrouped;
  // }

  /**
   * Get the assignments for some parts during a month
   * Update the pAssignments observable
   * @param month Luxon DateTime first day of the desired month
   * @param listOfParts Part[] List of parts we want to get the assignments on
   */
  getAssignmentsByPartsAndMonth(
    month: DateTime,
    listOfParts: Part[]
  ): Assignment[] {
    const assignments = this.getAssignments();
    let pAssignments: Assignment[];

    if (assignments !== null) {
      pAssignments = assignments.filter(
        (assignment) =>
          listOfParts.find((part) => part._id === assignment.part._id) !==
            undefined &&
          DateTime.fromJSDate(assignment.week).get('month') ===
            month.get('month')
      );

      this.pAssignmentsStore.next(pAssignments);
    } else {
      // pAssignments = this.generateAssignments(
      //   meeting,
      //   month,
      //   listOfParts,
      //   assignableUsersByPart
      // );

      // this.pAssignmentsStore.next(pAssignments);

      this.pAssignmentsStore.next([]);
    }

    return pAssignments;
    // // Get all the assignments of this month
    // const assignments = await this.http
    //   .get<any[]>(url)
    //   .pipe(
    //     tap((h) => {
    // const outcome = h ? `fetched` : `did not find`;
    // const monthFormatted = month.toFormat('L');
    // this.log(
    //   `${outcome} midweek-students assignments of month ${monthFormatted}`,
    //   'AssignmentService'
    // );
    //   }),
    //   catchError(this.handleError('getAssignmentsByMeetingAndMonth', []))
    // )
    // .toPromise();
    // console.log('ORIG', assignments);
    // Now group them by week then part name
    // const assignmentsGrouped = [];
    // assignments.forEach((week) => {
    //   assignmentsGrouped[week._id] = [];
    //   week.assignments.forEach((result) => {
    //     const partName = result._id.part + '-' + result._id.position;
    //     assignmentsGrouped[week._id][partName] = result.assignment;
    //   });
    // });

    // console.log('Group', assignmentsGrouped);
    // return assignmentsGrouped;
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

  // async getWeekendChairmanAssignmentByWeek(week: DateTime) {
  //   const weekendChairmanPart = ['weekend.publicTalk.chairman'];
  //   const url =
  //     this.assignmentsUrl +
  //     'partName/weekend.publicTalk.chairman/week/' +
  //     week.toFormat('Y-M-D');
  //   return this.http.get<any[]>(url).pipe(
  //     tap((h) => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       const weekFormatted = week.toFormat('L');
  //       this.log(
  //         `${outcome} weekend chairman assignments of week ${weekFormatted}`,
  //         'AssignmentService'
  //       );
  //     }),
  //     catchError(this.handleError('getWeekendChairmanAssignmentByWeek', []))
  //   );
  //   // // Get all the assignments of this week
  //   // const weekendChairman = await this.getAssignmentsByWeek(
  //   //   week,
  //   //   weekendChairmanPart
  //   // ).toPromise();

  //   // return weekendChairman[0];
  // }

  //////// Save methods //////////
  /**
   * @POST add a new assignment to the server
   */
  async addAssignment(assignment: Assignment): Promise<any> {
    try {
      const assignments = await this.callFunction('Assignments_insertMany', [
        [assignment],
      ]);

      this.updateStore(Assignment.fromJson(assignments) as Assignment[]);

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
      const assignments = await this.callFunction('Assignments_updateByIds', [
        [assignment._id],
        assignment,
      ]);

      this.updateStore(Assignment.fromJson(assignments) as Assignment[]);

      this.log(`updated assignment`);
    } catch (error) {
      this.handleError<any>('updateAssignment', error);
    }
  }

  /**
   * DELETE: delete the assignment from the server
   */
  async deleteAssignment(id: string[]): Promise<any> {
    try {
      const assignments = await this.callFunction('Assignments_deleteByIds', [
        id,
      ]);

      this.updateStore(Assignment.fromJson(assignments) as Assignment[]);

      this.log(`deleted assignment`);
    } catch (error) {
      this.handleError<any>('deleteAssignment', error);
    }
  }

  /**
   * Insert assignment if not existent, update it otherwise
   * @param assignments Assignment model object
   */
  async upsertAssignments(assignments: any, month?: string): Promise<void> {
    // : Observable<Assignment> {
    // console.log(assignments);
    // Extract all the assignments ids in case of an update
    const assignmentsIds = [];
    assignments.weeks.forEach((week) => {
      Object.values(week).forEach((ass) => {
        if (ass['_id']) {
          assignmentsIds.push(ass['_id']);
        }
      });
    });
    // console.log(assignmentsData);

    try {
      const result = await this.callFunction('Assignments_updateMany', [
        assignmentsIds,
        assignments,
      ]);

      this.updateStore(Assignment.fromJson(assignments) as Assignment[]);

      this.log(`Updated assignments (${month})`, 'AssignmentService');
    } catch (error) {
      this.handleError<any>('upsertAssignment', error);
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
