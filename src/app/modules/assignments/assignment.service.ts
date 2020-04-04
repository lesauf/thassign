import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DateTime } from 'luxon';

import { CommonService } from '../../core/services/common.service';
import { MessageService } from '../../core/services/message.service';
import { PartService } from '../../core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from '../users/user.service';

import { Assignment } from '../../shared/models/assignments.schema';
import { Part } from '../../shared/models/parts.schema';
import { tap, map, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  reportProgress: true
};

/**
 * Get data about assignments from storage
 */
@Injectable({
  providedIn: 'root'
})
export abstract class AssignmentService extends CommonService {
  public abstract weekendParts = [
    'weekend.publicTalk.chairman',
    'weekend.publicTalk.speaker',
    'weekend.watchtower.conductor',
    'weekend.watchtower.reader'
  ];

  private assignmentsUrl = 'api/assignment'; // URL to web api

  constructor(
    private http: HttpClient,
    messageService: MessageService,
    private partService: PartService,
    private settingService: SettingService,
    private userService: UserService
  ) {
    super(messageService);

    // generateAssignments(userService, partSer);
  }

  /**
   * Get all users from the server
   */
  getAssignments(): Observable<Assignment[]> {
    // TODO add to the query when doing server-side
    const assignmentsList = this.http
      .get<Assignment[]>(this.assignmentsUrl)
      .pipe(
        tap(_ => this.log('fetched assignments', 'AssignmentService')),
        map((result: Assignment[]) => {
          // sorting on client side,
          // TODO REMOVE when sorting on server side
          // console.log(result);
          return result.sort((a: Assignment, b: Assignment) => {
            // sort desc
            if (a.week > b.week) {
              return -1;
            }

            if (a.week < b.week) {
              return 1;
            }

            return 0;
          });
        }),
        catchError(this.handleError('getAssignments', []))
      );

    return assignmentsList;
  }

  /**
   * Get an assignment
   *
   * @param id: string
   */
  getAssignment(id?: number | string): Observable<Assignment> {
    // console.log(id);
    if (id) {
      // Fetch assignment from db
      const url = `${this.assignmentsUrl}/${id}`;
      return this.http.get<Assignment>(url).pipe(
        tap(_ => this.log(`fetched Assignment id=${id}`, 'AssignmentService')),
        catchError(this.handleError<Assignment>(`getAssignment id=${id}`))
      );
    } else {
      // create an empty user
      const assignment = new Assignment();
      // Set default values here
      return new BehaviorSubject(assignment).asObservable();
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
      tap(h => {
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
        tap(h => {
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
    weekendAssignments.forEach(week => {
      weekendAssignmentsGrouped[week._id] = [];
      week.parts.forEach(result => {
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
        tap(h => {
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
    assignments.forEach(week => {
      assignmentsGrouped[week._id] = [];
      week.assignments.forEach(result => {
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
      tap(h => {
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

  /** POST: add a new assignment to the server */
  addAssignment(assignment: Assignment) {
    // console.log(assignment);
    return this.http.post(this.assignmentsUrl, assignment, httpOptions).pipe(
      tap((addedAssignment: Assignment) =>
        this.log(
          `added assignment w/ id=${addedAssignment._id}`,
          'AssignmentService'
        )
      ),
      catchError(this.handleError<Assignment>('addAssignment'))
    );
  }

  /** PUT: update the assignment on the server */
  updateAssignment(assignment: Assignment) {
    const url = `${this.assignmentsUrl}/${assignment._id}`;
    // console.log(assignment);
    return this.http.put<Assignment>(url, assignment, httpOptions).pipe(
      tap(_ =>
        this.log(`Updated assignment id=${assignment._id}`, 'AssignmentService')
      ),
      catchError(this.handleError<any>('updateAssignment'))
    );
  }

  /** DELETE: delete the assignment from the server */
  deleteAssignment(assignment: Assignment | number): Observable<Assignment> {
    const id = typeof assignment === 'number' ? assignment : assignment.id;
    const url = `${this.assignmentsUrl}/${id}`;
    // console.log(id);
    return this.http.delete<Assignment>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted assignment id=${id}`, 'AssignmentService')),
      catchError(this.handleError<Assignment>('deleteAssignment'))
    );
  }

  /**
   * Insert assignment if not existent, update it otherwise
   * @param assignment Assignment model object
   */
  upsertAssignments(assignments: any, month?: string) {
    // : Observable<Assignment> {
    // console.log(assignments);
    // Converting form data to array and assignee to its id
    const assignmentsData = [];
    assignments.weeks.forEach(week => {
      Object.values(week).forEach(ass => {
        if (ass['assignee']) {
          ass['assignee'] = ass['assignee']._id;
          if (ass['assistant'] !== undefined) {
            ass['assistant'] = ass['assistant']._id;
          }
          assignmentsData.push(ass);
        }
      });
    });
    // console.log(assignmentsData);

    /** PUT: update the assignment on the server */
    const url = `${this.assignmentsUrl}`;
    // console.log(assignment);
    if (assignmentsData.length) {
      return this.http.post(url, assignmentsData, httpOptions).pipe(
        tap(_ =>
          this.log(`Updated assignments (${month})`, 'AssignmentService')
        ),
        catchError(
          this.handleError<any>('updateAssignment', null, 'AssignmentService')
        )
      );
    } else {
      return of(null).pipe(
        tap(_ => this.log(`Nothing to update`, 'AssignmentService'))
      );
    }
  }

  // saveWeekendAssignments(weekendAssignments: Array<any>) {
  //   this.upsertAssignment(weekendAssignments['chairman']);
  //   this.upsertAssignment(weekendAssignments['speaker']);
  //   this.upsertAssignment(weekendAssignments['conductor']);
  //   this.upsertAssignment(weekendAssignments['reader']);
  // }
}
