import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Input,
  Output,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  UntypedFormArray,
  FormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';
import { combineLatest, forkJoin, merge, Observable, Subscription, zip } from 'rxjs';

import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { AuthService } from '@src/app/modules/auth/auth.service';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
import { SettingService } from '@src/app/core/services/setting.service';
import { UserService } from '@src/app/modules/users/user.service';
import { ValidationService } from '@src/app/core/services/validation.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from '@src/app/core/models/part/part.model';
import { AssignmentControlService } from '@src/app/modules/assignments/services/assignment-control.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { map, tap } from 'rxjs/operators';
import { User } from '@src/app/core/models/user/user.model';

/**
 * Handle weekend assignments attributions
 * Chairman, speaker, Watchtower reader
 */
@Component({
  selector: 'app-assignment-midweek-students',
  templateUrl: './assignment-midweek-students.component.html',
  styleUrls: ['./assignment-midweek-students.component.scss'],
  providers: [AssignmentControlService],
})
export class AssignmentMidweekStudentsComponent
  extends AssignmentCommon
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  /**
   * Starting day of the month of this program
   */
  month: DateTime;

  /**
   * By default the form is disabled
   */
  @Output()
  editMode: EventEmitter<any> = new EventEmitter();

  @ViewChild('printableArea')
  printable: ElementRef;

  // @Output()
  // onSave: EventEmitter<Assignment[]> = new EventEmitter();

  meetingName = 'midweek-students';

  /**
   * paginated Assignments
   */
  pAssignments$: Observable<Assignment[]>;

  /**
   * Subscription to observable created by combining
   * Users and Assignments observables
   */
  data$: Subscription;

  studentsForm: UntypedFormGroup;

  payLoad = '';

  /**
   * Display the Loading msg
   */
  loading = false;

  constructor(
    private acs: AssignmentControlService,
    protected assignmentService: AssignmentService,
    protected backendService: BackendService,
    protected partService: PartService,
    protected userService: UserService,
    protected messageService: MessageService,
    protected formBuilder: UntypedFormBuilder,
    protected settingService: SettingService,
    protected _snackBar: MatSnackBar,
    protected _translate: TranslateService,
    protected validationService: ValidationService
  ) {
    super();
  }

  async ngOnInit() {
    await this.getParts();

    // Pipe to the assignments observable the filtering
    this.data$ = combineLatest([
      this.userService.data,
      this.assignmentService.data,
    ]).subscribe(async ([users, assignments]) => {
      if (this.listOfParts === undefined) {
        this.listOfParts = await this.partService.getPartsByMeeting(
          this.meetingName
        );
      }

      if (users !== null && assignments !== null) {
        // Display form only when observables have started emitting
        await this.initializeData();

        // Load the assignments of the default month (current)
        await this.initializeMonthData();

        this.assignmentService.getAssignmentsByPartsAndMonth(
          this.month,
          this.listOfParts
        );

        // Get the observable of the filtered assignments
        this.pAssignments$ = this.assignmentService.pAssignments.pipe(
          tap((pAssignments) => {
            this.separateAssignmentsByWeek(pAssignments);

            // Build the form
            this.prepareForm();
          })
        );
      }
    });
  }

  /**
   * Called whenever a data bound property is changed
   */
  async ngOnChanges(changes: SimpleChanges) {
    await this.initializeMonthData();
    
    if (this.listOfParts) {
      this.assignmentService.getAssignmentsByPartsAndMonth(
        this.month,
        this.listOfParts
      );
    }

    // Check if the previous form was in edit mode : useful ??
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
    }
  }

  ngOnDestroy(): void {
    // TODO: set an alert to inform the users that he is still in edit mode
    // Emit edit mode event (to enable navigation)
    // this.editMode.emit(false);
    // this.assignmentService.pAssignments.unsubscribe();
    this.data$.unsubscribe();
  }

  /**
   * Separate the assignments of the month by week
   */
  separateAssignmentsByWeek(pAssignments: Assignment[]) {
    // this.assignmentsByWeek = [];

    this.weeks.forEach((week, index) => {
      this.assignmentsByWeek[index] = pAssignments.filter((ass) => {
        return week.start.toISODate() === ass.week.toISODate();
      });
    });
  }

  /**
   * Prepare the form Data :
   *   - Assignments by week
   *   - FormGroup
   *   - Subscribe to the form changes to update assignementsByWeek
   */
  prepareForm(assignmentsByWeek?: Assignment[][]) {
    delete this.studentsForm;

    if (!assignmentsByWeek) {
      assignmentsByWeek = this.assignmentsByWeek;
    }

    this.studentsForm = this.acs.toFormGroup(assignmentsByWeek);

    this.studentsForm.valueChanges.subscribe((currentFormValues) => {
      this.updatePositions();
    });
  }

  /**
   * convert the form values to Assignment[] and update their positions
   */
  updatePositions() {
    this.weeks.forEach((week, wIndex) => {
      // convert the form data to Assignments Objects
      this.assignmentsByWeek[wIndex] = this.assignmentService.createAssignment(
        this.studentsForm.value[wIndex]
      ) as Assignment[];
    });
  }

  /**
   * Insert a new assignment selector in the form
   * With the subscription to the form valueChanges the assignmentsByWeek is
   * automatically updated too
   * @param week Week to insert at
   * @param wIndex position within the week
   */
  addAssignment(week: Interval, wIndex: string) {
    (this.studentsForm.get([wIndex]) as UntypedFormArray).insert(
      this.assignmentsByWeek[wIndex].length,
      this.acs.toAssignmentControl(
        new Assignment({
          week: week.start,
          position: this.assignmentsByWeek[wIndex].length,
          ownerId: this.backendService.getSignedInUser()._id,
          // part: null,
          // assignee: null,
          // assistant: null,
        })
      )
    );
  }

  removeAssignment(assignment: Assignment, wIndex: string) {
    (this.studentsForm.get([wIndex]) as UntypedFormArray).removeAt(
      assignment.position
    );
    // trigger valueChanges to update assignmentsByWeek

    this.prepareForm();
  }

  drop(event: CdkDragDrop<number>, wIndex: number) {
    const move = (this.studentsForm.get([
      event.previousContainer.data,
    ]) as UntypedFormArray).get([event.previousIndex]);

    (this.studentsForm.get([
      event.previousContainer.data,
    ]) as UntypedFormArray).removeAt(event.previousIndex);

    // Set the week
    move.get('week').setValue(this.weeks[wIndex].start);

    (this.studentsForm.get([event.container.data]) as UntypedFormArray).insert(
      event.currentIndex,
      move
    );

    // Update the positions in the form
    this.prepareForm();
  }

  /**
   * @todo extract the styles
   */
  saveAsPdf() {
    // window.print();

    const mywindow = window.open('', '', 'height=400,width=600');

    this._translate.get('assignments').subscribe((pageTitle) => {
      const printContents = this.printable.nativeElement.innerHTML;

      mywindow.document.write(
        '<!DOCTYPE html><html><head><title>' +
          pageTitle +
          ': ' +
          this.month.toFormat('MMMM yyyy') +
          '</title>'
      );
      // Styling 
      mywindow.document.write(
        '<style>' +
          'body { font-size: 1.2em }' +
          '.assignment-box:not(last-child) { margin: 0 0 1em; }' +
          '.week-box-view { width: 80%; margin: 0 auto; }' +
          '.assignment-assignee { font-weight: bold; }' +
          '</style>'
      );
      /*optional stylesheet*/
      mywindow.document.write('</head><body>');
      mywindow.document.write(printContents);
      mywindow.document.write('</body></html>');
      
      mywindow.document.execCommand('print');
      mywindow.close();
    });
  }

  setEditMode(value: boolean) {
    this.isEditMode = value;

    this.editMode.emit(value);
  }

  async onSubmit() {
    try {
      // Convert the assignmentsByWeek values from the form to Assignment list
      const a = [];
      this.weeks.forEach((week, wIndex) => {
        this.assignmentsByWeek[wIndex].forEach((assignment) =>
          a.push(assignment)
        );
      });

      this.payLoad = JSON.stringify(a, null, 1);

      this.loading = true;
      await this.assignmentService.saveAssignments(
        a,
        this.month,
        this.partService.getParts(),
        this.userService.getUsers()
      );

      this.loading = false;
      this.setEditMode(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Populate form, refresh and disable it
   */
  // async populateForm() {
  //   // Refresh the list of users (to have their latests assignments up to date)
  //   // this.getPartsAssignableList();

  //   // Get stored values
  //   const midweekAssignments = await this.assignmentService.getAssignmentsByMeetingAndMonth(
  //     'midweek-students',
  //     this.month
  //   );

  //   // Populate form with stored values if there are
  //   const weekForms = this.monthForm;

  //   // weekForms.controls.forEach((studentsForm: FormGroup, i) => {
  //   //   this.listOfPartsByWeek[i].forEach((partName, partIndex) => {
  //   //     // const partName = partNameFull.substr(0, partNameFull.indexOf('-'));

  //   //     const week = studentsForm.get([partIndex]).value.week;
  //   //     const position = studentsForm.get([partIndex]).value.position;

  //   //     if (midweekAssignments[week] !== undefined) {
  //   //       const partNameFull = this[partName + 'Part'].name;
  //   //       const partNameFullWithPosition = partNameFull + '-' + position;

  //   //       if (
  //   //         midweekAssignments[week][partNameFullWithPosition] !== undefined
  //   //       ) {
  //   //         // Type casting to remove TS errors
  //   //         ((this.monthForm.get('weeks') as FormArray).at(
  //   //           i
  //   //         ) as FormGroup).controls[partIndex].patchValue(
  //   //           midweekAssignments[week][partNameFullWithPosition]
  //   //         );
  //   //       }
  //   //     }
  //   //   });
  //   // });
  // }

  // async saveForm(formData) {
  //   try {
  //     await this.assignmentService.upsertAssignments(
  //       formData,
  //       this.month.toFormat(this.settingService.getDateFormat('parseMonth'))
  //     );

  //     this._translate.get('assignment-save-success').subscribe((message) => {
  //       this.messageService.presentToast(message);
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
