import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DateTime, Interval } from 'luxon';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { CommonService } from '@src/app/core/services/common.service';
import { MessageService } from '@src/app/core/services/message.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';
import { BackendService } from '@src/app/core/services/backend.service';
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
    protected messageService: MessageService,
    private authService: AuthService,
    protected backendService: BackendService
  ) {
    super();

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
    allParts: Part[],
    allUsers: User[]
  ): Assignment | Assignment[] {
    if (props instanceof Array) {
      return props.map((obj, index) => {
        // Set the assignment position as its position in the array

        // Replace part, assignee and assistant with model object
        if (obj.part.hasOwnProperty('id')) {
          // from DB
          // delete obj._id; // Remove the _id, so in case it should be saved, mongoDb regenerate
          obj.part = allParts.find((part) => part.name === obj.part);
          obj.assignee = allUsers.find((user) => user._id === obj.assignee);
          obj.assistant = obj.assistant
            ? allUsers.find((user) => user._id === obj.assistant)
            : null;
        } else if (obj.part.hasOwnProperty('_id')) {
          // from form, with selected part
          obj.ownerId = this.backendService.getSignedInUser()._id;
          obj.position = index;
          obj.part = allParts.find((part) => part.name === obj.part.name);
          obj.assignee = obj.assignee
            ? allUsers.find((user) => user._id === obj.assignee._id)
            : null;
          obj.assistant = obj.assistant
            ? allUsers.find((user) => user._id === obj.assistant._id)
            : null;
        }

        // obj.part = this.partService
        return new Assignment(obj);
      }) as Assignment[];
    } else {
      return new Assignment(props) as Assignment;
    }
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
   * Get users from store
   */
  getAssignments(): Assignment[] {
    return this.dataStore.getValue();
  }

  /**
   * Get all users from the server
   */
  storeAssignments(
    assignments: any[],
    allParts: Part[],
    allUsers: User[]
  ): Assignment[] {
    try {
      // Convert results to Assignment objects
      const allAssignments = this.createAssignment(
        assignments,
        allParts,
        allUsers
      ) as Assignment[];
      // Sort
      // result.sort((a: Assignment, b: Assignment) => {
      //   // sort desc
      //   if (a.week > b.week) {
      //     return -1;
      //   }

      //   if (a.week < b.week) {
      //     return 1;
      //   }

      //   return 0;
      // });

      this.updateStore(allAssignments);
      this.log('fetched Assignments', 'AssignmentService');

      return allAssignments;
    } catch (error) {
      return this.handleError('storeAssignments', error, [], '');
    }
  }

  /**
   * Get an assignment
   *
   * @param id: string
   */
  // getAssignment(id?: number | string): Assignment {
  //   try {
  //     if (id) {
  //       // Get assignment from store
  //       this.log(`fetched assignment id=${id}`);

  //       return this.getAssignments().find(
  //         (assignment) => assignment._id === id
  //       );
  //     } else {
  //       // create an empty assignment with default values
  //       return new Assignment({
  //         ownerId: this.backendService.getSignedInUser()._id,
  //       });
  //     }
  //   } catch (error) {
  //     this.handleError<any>(`getAssignment id=${id}`, error);
  //   }
  // }

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
          listOfParts.find((part) => part.name === assignment.part.name) !==
            undefined && month.get('month') === assignment.week.get('month')
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
      await this.backendService.upsertOneDoc(
        'assignments',
        new AssignmentConverter(),
        assignment
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
        new AssignmentConverter(),
        assignment,
        assignment._id,
        'set',
        true
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
          new AssignmentConverter(),
          assignmentId as String[],
          'delete'
        );

        this.log(`deleted assignments`);
      } else {
        // Only one assignment
        await this.backendService.upsertOneDoc(
          'users',
          new AssignmentConverter(),
          null,
          assignmentId as string,
          'delete'
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
          AssignmentConverter,
          assToDelete,
          'delete'
        );
      }

      // Then insert the new ones
      await this.backendService.upsertManyDocs(
        'assignments',
        new AssignmentConverter(),
        toSave,
        'set'
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
