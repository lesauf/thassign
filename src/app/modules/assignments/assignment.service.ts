import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { AuthService } from '../auth/auth.service';
import { CommonService } from '../../core/services/common.service';
import { MessageService } from '../../core/services/message.service';
import { PartService } from '../../core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from '../users/user.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';

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

  private assignmentsUrl = 'api/assignment'; // URL to web api

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
   * GET assignments by week
   * @param week as a DateTime object
   * @param partNames List of part we want to filter
   */
  getAssignmentsByWeek(
    week: DateTime,
    partNames?: string[]
  ): Observable<Assignment[]> {
    const url = this.assignmentsUrl + '/week/' + week.toFormat('YYYY-MM-DD');
    return this.http.get<Assignment[]>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        const weekFormatted = week.toFormat('L');
        this.log(
          `${outcome} assignments of week ${weekFormatted}`,
          'AssignmentService'
        );
      }),
      catchError(this.handleError('getAssignmentsByWeek', []))
    );
  }

  // async getWeekendAssignmentsByWeek(week: DateTime) {
  //   // console.log(week.toFormat('YYYY-MM-DD'));
  //   const url =
  //     this.assignmentsUrl +
  //     '/meeting/weekend/week/' +
  //     week.toFormat('YYYY-MM-DD');

  //   // // Get all the assignments of this week
  //   const weekendAssignments = await this.http
  //     .get<any[]>(url)
  //     .pipe(
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         const weekFormatted = week.toFormat('L');
  //         this.log(
  //           `${outcome} weekend assignments of week ${weekFormatted}`,
  //           'AssignmentService'
  //         );
  //       }),
  //       catchError(this.handleError('getWeekendAssignmentsByWeek', []))
  //     )
  //     .toPromise();

  //   // const weekendAssignments = await this.getAssignmentsByWeek(
  //   //   week,
  //   //   this.weekendParts
  //   // ).toPromise();

  //   // Now group them by part name
  //   const weekendAssignmentsGrouped = [];
  //   weekendAssignments.forEach(result => {
  //     weekendAssignmentsGrouped[result._id] = result.assignment;
  //   });

  //   return weekendAssignmentsGrouped;
  // }

  async getWeekendAssignmentsByMonth(month: DateTime) {
    // console.log(week.toFormat('YYYY-MM-DD'));
    const url =
      this.assignmentsUrl +
      '/meeting/weekend/month/' +
      month.toFormat(this.settingService.getDateFormat('store'));

    // // Get all the assignments of this week
    const weekendAssignments = await this.http
      .get<any[]>(url)
      .pipe(
        tap((h) => {
          const outcome = h ? `fetched` : `did not find`;
          const monthFormatted = month.toFormat('L');
          this.log(
            `${outcome} weekend assignments of month ${monthFormatted}`,
            'AssignmentService'
          );
        }),
        catchError(this.handleError('getWeekendAssignmentsByMonth', []))
      )
      .toPromise();
    // console.log(weekendAssignments);
    // Now group them by week then part name
    const weekendAssignmentsGrouped = [];
    weekendAssignments.forEach((week) => {
      weekendAssignmentsGrouped[week._id] = [];
      week.parts.forEach((result) => {
        weekendAssignmentsGrouped[week._id][result._id.part] =
          result.assignment;
      });
    });

    return weekendAssignmentsGrouped;
  }

  async getAssignmentsByMeetingAndMonth(meeting: string, month: DateTime) {
    const url =
      this.assignmentsUrl +
      '/meeting/' +
      meeting +
      '/month/' +
      month.toFormat(this.settingService.getDateFormat('store'));

    // // Get all the assignments of this month
    const assignments = await this.http
      .get<any[]>(url)
      .pipe(
        tap((h) => {
          const outcome = h ? `fetched` : `did not find`;
          const monthFormatted = month.toFormat('L');
          this.log(
            `${outcome} midweek-students assignments of month ${monthFormatted}`,
            'AssignmentService'
          );
        }),
        catchError(this.handleError('getAssignmentsByMeetingAndMonth', []))
      )
      .toPromise();
    // console.log('ORIG', assignments);
    // Now group them by week then part name
    const assignmentsGrouped = [];
    assignments.forEach((week) => {
      assignmentsGrouped[week._id] = [];
      week.assignments.forEach((result) => {
        const partName = result._id.part + '-' + result._id.position;
        assignmentsGrouped[week._id][partName] = result.assignment;
      });
    });

    // console.log('Group', assignmentsGrouped);
    return assignmentsGrouped;
  }

  async getWeekendChairmanAssignmentByWeek(week: DateTime) {
    const weekendChairmanPart = ['weekend.publicTalk.chairman'];
    const url =
      this.assignmentsUrl +
      'partName/weekend.publicTalk.chairman/week/' +
      week.toFormat('Y-M-D');
    return this.http.get<any[]>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        const weekFormatted = week.toFormat('L');
        this.log(
          `${outcome} weekend chairman assignments of week ${weekFormatted}`,
          'AssignmentService'
        );
      }),
      catchError(this.handleError('getWeekendChairmanAssignmentByWeek', []))
    );
    // // Get all the assignments of this week
    // const weekendChairman = await this.getAssignmentsByWeek(
    //   week,
    //   weekendChairmanPart
    // ).toPromise();

    // return weekendChairman[0];
  }

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
}
