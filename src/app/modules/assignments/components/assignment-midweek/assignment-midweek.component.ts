import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { MY_FORMATS } from '@src/app/shared/components/month-picker/month-picker.component';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { PartService } from '@src/app/core/services/part.service';
import { ProgramService } from '@src/app/core/services/program.service';
import { UserService } from '@src/app/modules/users/user.service';
import { Program } from '@src/app/core/models/program.model';

@Component({
  selector: 'app-assignment-midweek',
  templateUrl: './assignment-midweek.component.html',
  styleUrls: ['./assignment-midweek.component.scss'],
})
export class AssignmentMidweekComponent
  extends AssignmentCommon
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  /**
   * Starting day of the month of this program
   */
  month: DateTime;

  @Output()
  editMode: EventEmitter<any> = new EventEmitter();

  currentWeek: DateTime;

  dateFormat = MY_FORMATS.display.dateA11yLabel;

  meetingName = 'midweek';

  /**
   * Map of week to programs
   * week => Program
   */
  mPrograms: Map<string, Program>;

  /**
   * current month programs
   */
  mPrograms$: Observable<Map<string, Program>>;

  /**
   * Subscription to observable created by combining
   * Users and Assignments observables
   */
  data$: Subscription;

  programsForm: FormGroup;

  constructor(
    protected assignmentService: AssignmentService,
    protected backendService: BackendService,
    protected partService: PartService,
    protected programService: ProgramService,
    protected translateService: TranslateService,
    protected userService: UserService
  ) {
    super();
  }

  async ngOnInit() {
    // await this.getParts();

    // Pipe to the assignments observable
    this.data$ = combineLatest([
      this.userService.data,
      this.assignmentService.data,
    ]).subscribe(async ([users, assignments]) => {
      if (users !== null && assignments !== null) {
        // Display form only when observables have started emitting
        await this.initializeData();

        // Load the assignments of the default month (current)
        // await this.initializeMonthData();

        await this.programService.getProgramsByMonth('midweek', this.month);


        // Get the observable of the this month programs
        this.mPrograms$ = this.programService.mPrograms.pipe(
          tap((mPrograms) => {
            this.mPrograms = mPrograms;
            // Build the form
            this.prepareForm();
          })
        );
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Get the first week as the first monday of the month
    this.currentWeek = this.month.set({ weekday: 8 });

    this.mPrograms$ = undefined; // to start the loader

    // Check if the previous form was in edit mode : useful ??
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
    }
  }

  ngOnDestroy() {}

  /**
   * Prepare the form Data :
   *   - Assignments by week
   *   - FormGroup
   *   - Subscribe to the form changes to update assignementsByWeek
   */
  prepareForm() {
    delete this.programsForm;

    const group: any = {};

    this.mPrograms.forEach((program, week) => {
      const assignmentsArray = [];

      // Prepare the assignments form array
      program.assignments.forEach((assignment) => {
        // console.log(assignment);
        assignmentsArray[assignment.position] = new FormGroup({
          week: new FormControl(assignment.week || ''),
          part: new FormControl(assignment.part || ''),
          assignee: new FormControl(assignment.assignee || ''),
          hall: new FormControl(assignment.hall || ''),
          ownerId: new FormControl(assignment.ownerId || ''),
          position: new FormControl(assignment.position),
          // ...(assignment.part?.withAssistant && {
          assistant: new FormControl(assignment.assistant || ''),
          // }),
          // ...(assignment.part?.withTitle && {
          title: new FormControl(assignment.title || ''),
          // }),
          // ...(assignment.part?.withTitle && {
          description: new FormControl(assignment.description || ''),
          // }),
          // ...(assignment.number && {
          number: new FormControl(assignment.number || ''),
          // }),
        });
      });

      // Now prepare the program form itself
      group[week] = new FormGroup({
        _id: new FormControl(program._id || ''),
        month: new FormControl(program.month || ''),
        week: new FormControl(program.week || ''),
        meeting: new FormControl(program.meeting || ''),
        ownerId: new FormControl(
          program.ownerId || this.backendService.getSignedInUser()._id
        ),
        assignments: new FormArray(assignmentsArray),
      });
    });

    //
    this.programsForm = new FormGroup(group);
  }

  onSubmit() {
    console.log(this.programsForm.value);
  }

  getMondays() {
    let d = new Date();
    let month = d.getMonth();
    let tuesdays = [];

    d.setDate(1);

    // Get the first Monday in the month
    d.setDate(d.getDate() + ((8 - d.getDay()) % 7));
    // while (d.getDay() !== 1) {
    //     d.setDate(d.getDate() + 1);
    // }

    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
      tuesdays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
    }

    return tuesdays;
  }
}
