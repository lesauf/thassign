import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';
import { combineLatest, concat, Observable, of, Subscription } from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';

import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { AssignableListComponent } from '@src/app/modules/assignments/components/assignable-list/assignable-list.component';
import { MY_FORMATS } from '@src/app/shared/components/month-picker/month-picker.component';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { PartService } from '@src/app/core/services/part.service';
import { ProgramService } from '@src/app/core/services/program.service';
import { UserService } from '@src/app/modules/users/user.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from '@src/app/core/models/part/part.model';
import { Program } from '@src/app/core/models/program.model';
import { User } from '@src/app/core/models/user/user.model';

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

  @ViewChild('printableArea')
  printable: ElementRef;

  public displayComponentRef: ComponentRef<AssignableListComponent<User>>;

  // currentWeek: DateTime;

  // dateFormat = MY_FORMATS.display.dateA11yLabel;

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

  programsForm: UntypedFormGroup;

  /**
   * Display the Loading msg
   */
  loading = false;

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

  ngOnInit() {
    // Pipe to the assignments observable
    this.data$ = combineLatest([
      this.userService.data,
      this.programService.data,
      // this.translateService.onLangChange.asObservable(),
    ]).subscribe(async ([users, programs]) => {
      if (users !== null && programs !== null) {
        // Display form only when observables have started emitting
        await this.initializeData();

        // Load the assignments of the default month (current)
        // await this.initializeMonthData();

        await this.programService.getProgramsByMonth('midweek', this.month);

        this.mPrograms$ = this.programService.mPrograms.pipe(
          map((v) => (v === null ? new Map() : v)), // Map null to empty map
          delay(0), // Useful to prevent an error about loading property
          tap((mPrograms) => {
            this.mPrograms = mPrograms;

            // Build the form
            this.prepareForm();

            this.showLoader(false);
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
    this.showLoader();

    // Get the first week as the first monday of the month
    // this.currentWeek = this.month.set({ weekday: 8 });

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
    // delete this.programsForm; // Why did I wanted to delete ?

    const group: any = {};

    // if (this.mPrograms !== null) {
    // We do nothing on the initial config
    this.mPrograms.forEach((program, week) => {
      group[week] = program.toFormGroup(
        this.backendService.getSignedInUser()._id
      );
    });
    // }

    //
    this.programsForm = new UntypedFormGroup(group);
  }

  /**
   * On form change, update the assignments so that we should know
   * of all assignments
   */
  subscribeToFormChanges() {
    this.programsForm.valueChanges.subscribe((editedPrograms) => {
      // Add the assignments being made to the list
      // 1. Build a map of all current edited assignments
      let tmpArr = [];
      Object.keys(editedPrograms).forEach((week) => {
        const convAss = this.assignmentService.createAssignment(
          editedPrograms[week].assignments
        ) as Assignment[];
        tmpArr = tmpArr.concat(convAss.map((a) => [a.key, a]));
      });
      const currentAss = new Map(tmpArr);

      // 2. get a copy of the existing assignments
      const allAssignments = new Map(this.assignmentService.getAssignments());

      // 3. merge the two maps
      const mergedAss = new Map([...allAssignments, ...currentAss]) as Map<
        string,
        Assignment
      >;

      this.assignmentService.groupAssignmentsByUser(mergedAss);
    });
  }

  showLoader(status = true) {
    this.loading = status;

    // While loading we disable the picker
    if (status) {
      // this.setEditMode(true);
    }
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

    this.showLoader();
    this.programService.savePrograms(toSave);

    this.showLoader(false);
    this.setEditMode(false);
  }

  /**
   * Check if the current user is handling the given part
   * @param part
   */
  isWorkingOnPart(part: Part): boolean {
    return this.assignmentService.isWorkingOnPart(part);
  }

  getDisplayStudentsParts(): boolean {
    return this.assignmentService.displayStudentsParts;
  }

  /**
   *
   * Second click on chip deselect it
   * @param displayStudentsParts
   */
  setDisplayStudentsParts(displayStudentsParts: boolean) {
    if (displayStudentsParts === this.assignmentService.displayStudentsParts) {
      this.assignmentService.displayStudentsParts = undefined;
    } else {
      this.assignmentService.displayStudentsParts = displayStudentsParts;
    }
  }

  // getMondays() {
  //   let d = new Date();
  //   let month = d.getMonth();
  //   let tuesdays = [];

  //   d.setDate(1);

  //   // Get the first Monday in the month
  //   d.setDate(d.getDate() + ((8 - d.getDay()) % 7));
  //   // while (d.getDay() !== 1) {
  //   //     d.setDate(d.getDate() + 1);
  //   // }

  //   // Get all the other Mondays in the month
  //   while (d.getMonth() === month) {
  //     tuesdays.push(new Date(d.getTime()));
  //     d.setDate(d.getDate() + 7);
  //   }

  //   return tuesdays;
  // }
}
