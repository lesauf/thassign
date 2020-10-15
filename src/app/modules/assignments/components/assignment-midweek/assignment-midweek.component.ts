import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
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
import { AssignableListComponent } from '@src/app/modules/assignments/components/assignable-list/assignable-list.component';
import { MY_FORMATS } from '@src/app/shared/components/month-picker/month-picker.component';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { PartService } from '@src/app/core/services/part.service';
import { ProgramService } from '@src/app/core/services/program.service';
import { UserService } from '@src/app/modules/users/user.service';
import { Program } from '@src/app/core/models/program.model';
import { User } from '@src/app/core/models/user/user.model';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';

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

  public displayComponentRef: ComponentRef<AssignableListComponent<User>>;

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
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
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

            this.subscribeToFormChanges();
          })
        );
      }
    });

    // Getting the template of the picker
    const componentFactory = this.resolver.resolveComponentFactory(
      AssignableListComponent
    );
    this.displayComponentRef = componentFactory.create(this.injector);
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Get the first week as the first monday of the month
    this.currentWeek = this.month.set({ weekday: 8 });

    // this.mPrograms$ = undefined; // to start the loader

    await this.programService.getProgramsByMonth('midweek', this.month);

    // Check if the previous form was in edit mode : useful ??
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
    }
  }

  ngOnDestroy() {
    this.displayComponentRef.destroy();
  }

  /**
   * Prepare / init the formGroup :
   *   - FormGroup
   *   - Subscribe to the form changes to update assignementsByWeek
   */
  prepareForm() {
    delete this.programsForm;

    const group: any = {};

    this.mPrograms.forEach((program, week) => {
      group[week] = program.toFormGroup(
        this.backendService.getSignedInUser()._id
      );
    });

    //
    this.programsForm = new FormGroup(group);
  }

  /**
   * On form change, update the assignments so that we should know
   * of all assignments
   */
  subscribeToFormChanges() {
    this.programsForm.valueChanges.subscribe((editedPrograms) => {
      // Add the assignments being made to the list
      // TODO Get all the assignments from the programs instead
      let allAssignments = this.assignmentService.getAssignments();
      
      Object.keys(editedPrograms).forEach((week) => {
        allAssignments = allAssignments.concat(
          editedPrograms[week].assignments
        );
      });

      this.assignmentService.groupAssignmentsByUser(allAssignments);
    });
  }

  cancelEdit() {
    this.setEditMode(false);

    this.prepareForm();

    // Reset AssignmentService.assignmentsByUser
    this.assignmentService.groupAssignmentsByUser();
  }

  onSubmit() {
    const formValue = Object.values(this.programsForm.value);

    // convert to Program objects
    const toSave = this.programService.createProgram(formValue) as Program[];
 
    this.programService.savePrograms(toSave);

    this.setEditMode(false);
  }

  /**
   * Add the assignment to the AssignmentService::assignmentsByUser
   */
  extractAllAssignmentsFromProgram(program: any) {
    const assignments = [];
    program.assignments.forEach((assignment) => {
      if (assignment.assignee !== '') {
        // user assigned, add it to his list of assignments
        assignment = new Assignment(assignment);
        (assignment.assignee as User).assignments[assignment.key] = assignment;
      }
    });
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
