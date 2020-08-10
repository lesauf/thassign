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
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';
import { Observable } from 'rxjs';

import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { AssignmentService } from 'src/app/modules/assignments/assignment.service';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PartService } from 'src/app/core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/modules/users/user.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';
import { AssignmentControlService } from '@src/app/modules/assignments/assignment-control.service';

// export const DATE_FORMATS = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
//   store: {
//     dateInput: 'YYYY-MM-DD',
//   },
// };

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
export class AssignmentMidweekStudentsComponent extends AssignmentCommon
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
  // pAssignments$: Observable<Assignment[]>;

  studentsForm: FormGroup;

  payLoad = '';

  /**
   * Display the Loading msg
   */
  loading = false;

  constructor(
    private acs: AssignmentControlService,
    protected assignmentService: AssignmentService,
    protected authService: AuthService,
    protected partService: PartService,
    protected userService: UserService,
    protected messageService: MessageService,
    protected formBuilder: FormBuilder,
    protected settingService: SettingService,
    protected _snackBar: MatSnackBar,
    protected _translate: TranslateService,
    protected validationService: ValidationService
  ) {
    super();
  }

  async ngOnInit() {
    // this._getTranslations();
    //   this.getAssignableList();
    // this.userService.data.subscribe((users) => {
    //   this.users = users;
    //   this.pUsers$ = this.userService.pUsers;
    // this.getUsers();
    // });
  }

  ngOnDestroy(): void {
    // TODO: set an alert to inform the users that he is still in edit mode
    // Emit edit mode event (to enable navigation)
    // this.editMode.emit(false);
    // this.assignmentService.pAssignments.unsubscribe();
  }

  /**
   * Called whenever a data bound property is changed
   */
  async ngOnChanges(changes: SimpleChanges) {
    this.loading = true;

    await this.initializeData();

    if (changes.month.isFirstChange()) {
      // Fetch meeting parts once
      // await this.getParts('midweek-students');

      this.assignmentService.pAssignments.subscribe((assignments) => {
        delete this.studentsForm;
        // Separate the assignments by week and assign them numbers
        const assignmentsByWeek = [];
        this.weeks.forEach((week, index) => {
          this.assignmentsByWeek[index] = assignments.filter((ass) => {
            return week.start.toISODate() === ass.week.toISODate();
          });
        });

        // The form has to be ready before assignmentsByWeek
        this.prepareForm();
        // this.assignmentsByWeek = assignmentsByWeek;
        // this.studentsForm.updateValueAndValidity();
      });
    }

    // Check if the previous form was in edit mode
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
    }

    this.assignmentService.getAssignmentsByPartsAndMonth(
      this.month,
      this.listOfParts
    );

    this.loading = false;
  }

  /**
   * Prepare the form Data :
   *   - Assignments by week
   *   - FormGroup
   *   - Subscribe to the form changes to update assignementsByWeek
   */
  prepareForm(assignmentsByWeek?: Assignment[][]) {
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
      this.assignmentsByWeek[wIndex] = this.assignmentService.createAssignment(
        this.studentsForm.value[wIndex],
        this.partService.getParts(),
        this.userService.getUsers()
      ) as Assignment[];
    });
  }

  addAssignment(week: Interval, wIndex: string) {
    (this.studentsForm.get([wIndex]) as FormArray).insert(
      this.assignmentsByWeek[wIndex].length,
      this.acs.toAssignmentControl(
        new Assignment({
          week: week.start,
          position: this.assignmentsByWeek[wIndex].length,
          ownerId: this.authService.getUser().id,
          // part: new Part({}),
          // assignee: {},
          // assistant: {},
        })
      )
    );
  }

  removeAssignment(assignment: Assignment, wIndex: string) {
    (this.studentsForm.get([wIndex]) as FormArray).removeAt(
      assignment.position
    );
    // trigger valueChanges to update assignmentsByWeek

    this.prepareForm();
  }

  drop(event: CdkDragDrop<number>, wIndex: number) {
    const move = (this.studentsForm.get([
      event.previousContainer.data,
    ]) as FormArray).get([event.previousIndex]);

    (this.studentsForm.get([
      event.previousContainer.data,
    ]) as FormArray).removeAt(event.previousIndex);

    // Set the week
    move.get('week').setValue(this.weeks[wIndex].start);

    (this.studentsForm.get([event.container.data]) as FormArray).insert(
      event.currentIndex,
      move
    );

    // Update the positions in the form
    this.prepareForm();
  }

  saveAsPdf() {
    // window.print();

    this._translate.get('assignments').subscribe((pageTitle) => {
      const printContents = this.printable.nativeElement.innerHTML;

      const mywindow = window.open('', 'new div', 'height=400,width=600');
      mywindow.document.write(
        '<html><head><title>' +
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
          '.assignments-list {  }' +
          '</style>'
      );
      /*optional stylesheet*/
      mywindow.document.write('</head><body>');
      mywindow.document.write(printContents);
      mywindow.document.write('</body></html>');

      mywindow.print();
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
