import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Input,
  Output,
  SimpleChanges,
  OnDestroy,
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

import { AssignmentCommon } from '../assignment.common';
import { AssignmentService } from 'src/app/modules/assignments/assignment.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PartService } from 'src/app/core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/modules/users/user.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';
import { AssignmentControlService } from '../../assignment-control.service';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  store: {
    dateInput: 'YYYY-MM-DD',
  },
};

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

  @Output()
  editMode: EventEmitter<any> = new EventEmitter();

  meetingName = 'midweek-students';

  assignments: Assignment[] = [];

  /**
   * paginated Users
   */
  pAssignments$: Observable<Assignment[]>;

  studentsForm: FormGroup;

  payLoad = '';

  /**
   * Selected value for this assignment
   */
  bibleReadingAssignment: Assignment;
  initialCallAssignment: Assignment;
  firstReturnVisitAssignment: Assignment;
  secondReturnVisitAssignment: Assignment;
  bibleStudyAssignment: Assignment;
  studentTalkAssignment: Assignment;
  studentAssistantAssignment: Assignment;

  /**
   * Current week beeing displayed
   */
  currentWeek: Interval;

  constructor(
    private acs: AssignmentControlService,
    protected assignmentService: AssignmentService,
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
    // messageService,
    // formBuilder,
    // settingService,
    // _snackBar,
    // _translate,
    // validationService
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
    this.editMode.emit(false);
    // this.assignmentService.pAssignments.unsubscribe();
  }

  /**
   * Called whenever a data bound property is changed
   */
  async ngOnChanges(changes: SimpleChanges) {
    this.initializeData();

    if (changes.month.isFirstChange()) {
      // Fetch meeting parts once
      await this.getParts('midweek-students');

      this.assignmentService.pAssignments.subscribe((assignments) => {
        this.assignments = assignments;
        this.prepareForm();

        this.studentsForm.valueChanges.subscribe((currentFormValues) => {
          this.assignments = Assignment.fromJson(
            currentFormValues.assList
          ) as Assignment[];
        });
      });
    }

    // Check if the previous form was in edit mode
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
    }

    // this.assignments = this.assignmentService.getAssignmentsByMeetingAndMonth(
    this.assignmentService.getAssignmentsByPartsAndMonth(
      this.month,
      this.listOfParts
    );
    // this.studentsForm = this.acs.toFormArray(this.assignments);
  }

  /**
   * Prepare the form Data :
   *   - Assignments by week
   *   - FormGroup
   *   - set assignment position as the index in array
   */
  prepareForm() {
    // Separate the assignments by week and assign them numbers
    this.weeks.forEach((week, index) => {
      this.assignmentsByWeek[index] = this.assignments.filter(
        (ass) =>
          DateTime.fromJSDate(ass.week).get('weekNumber') ===
          week.start.get('weekNumber')
      );
    });

    this.studentsForm = this.acs.toFormArray(this.assignments);

    // Set the assignment position as the same in the array
    this.assignments.forEach((a, i) => {
      this.assignments[i].position = i;
    });
  }

  newAssignment(week: Interval, weekIndex: number) {
    this.assignments.push(
      new Assignment({
        week: week.start.toJSDate(),
        position: this.assignments.length,
      })
    );

    this.prepareForm();
  }

  removeAssignment(assignment: Assignment) {
    this.studentsForm.updateValueAndValidity();
    this.assignments.splice(assignment.position, 1);
    // (
    //   this.studentsForm.get(['assList']) as FormArray
    // )
    // .removeAt(assignment.position);

    this.prepareForm();
  }

  drop(event: CdkDragDrop<Assignment>) {
    // this.assignments = Assignment.fromJson(
    //   this.studentsForm.get('assList').value
    // ) as Assignment[];

    // console.log('DRAG', event.previousIndex, '->', event.currentIndex);

    // TODO change week on drag between
    // moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);

    this.prepareForm();
  }

  /**
   * Tell if the assignment is the first of the week
   */
  isStartNewWeek(assignment: Assignment): boolean {
    const startDate = DateTime.fromJSDate(assignment.week);
    const endDate = startDate.plus({ days: 6 });

    if (this.currentWeek && this.currentWeek.start.equals(startDate)) {
      return false;
    }

    this.currentWeek = Interval.fromDateTimes(startDate, endDate);

    return true;
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.studentsForm.value, null, 1);
  }

  // generateForm() {
  //   const weekForms = this.formBuilder.array([]);

  //   this.weeks.forEach((week, index) => {
  //     let position = 1;
  //     // TODO fetch from the db, from the epub
  //     const weekForm = {};
  //     this.listOfPartsByWeek[index].forEach((partName, partIndex) => {
  //       // Set the position for repetitive parts
  //       const previousPartName = this.listOfPartsByWeek[index][partIndex - 1];
  //       if (previousPartName === partName) {
  //         position = weekForm[partIndex - 1].get('position').value + 1;
  //       }
  //       weekForm[partIndex] = this.getPartForm(partName, week, position);
  //     });

  //     console.log(weekForm);
  //     weekForms.push(this.formBuilder.group(weekForm));
  //   });

  //   // this.monthForm = this.formBuilder.group({
  //   //   weeks: weekForms,
  //   // });
  //   this.monthForm = weekForms;

  //   console.log('WeeksForm', this.monthForm);
  //   // console.log('Separate', weekForms);
  //   this.monthForm.disable(); // Disabled by default to prevent editing
  // }

  /**
   * Build the individuals form/field for each part
   */
  // getPartForm(
  //   partName: string,
  //   week: Interval,
  //   position: number = 1
  // ): FormGroup {
  //   const partsForms = {
  //     bibleReading: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.bibleReadingPart,
  //       assignee: [''],
  //       position: position,
  //     }),
  //     initialCall: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.initialCallPart,
  //       assignee: [''],
  //       assistant: [''],
  //       position: position,
  //       title: 'A definir',
  //       number: 0,
  //     }),
  //     firstReturnVisit: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.firstReturnVisitPart,
  //       assignee: [''],
  //       assistant: [''],
  //       position: position,
  //     }),
  //     secondReturnVisit: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.secondReturnVisitPart,
  //       assignee: [''],
  //       assistant: [''],
  //       position: position,
  //     }),
  //     bibleStudy: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.bibleStudyPart,
  //       assignee: [''],
  //       assistant: [''],
  //       position: position,
  //     }),
  //     studentTalk: this.formBuilder.group({
  //       _id: '',
  //       week: week,
  //       part: this.studentTalkPart,
  //       assignee: [''],
  //       position: position,
  //     }) as FormGroup,
  //   };

  //   return partsForms[partName];
  // }

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
