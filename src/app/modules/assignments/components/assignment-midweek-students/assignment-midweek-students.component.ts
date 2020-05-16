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
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime, Interval } from 'luxon';
import { TranslateService } from '@ngx-translate/core';

import { AssignmentCommon } from '../assignment.common';
import { AssignmentService } from 'src/app/modules/assignments/assignment.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PartService } from 'src/app/core/services/part.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/modules/users/user.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';

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

  studentsForm: FormGroup;

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
   * MidweekStudents Parts
   */
  bibleReadingPart: Part;
  initialCallPart: Part;
  firstReturnVisitPart: Part;
  secondReturnVisitPart: Part;
  bibleStudyPart: Part;
  studentTalkPart: Part;
  studentAssistantPart: Part;

  constructor(
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

  ngOnInit() {
    // this._getTranslations();
    //   this.getAssignableList();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    // TODO: set an alert to inform the users that he is still in edit mode
    // Emit edit mode event (to enable navigation)
    this.editMode.emit(false);
  }

  /**
   * Called whenever a data bound property is changed
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (this.listOfParts === undefined) {
      // Fetch parts if not yet available
      await this.getParts('midweek-students');
    }

    // Check if the previous form was in edit mode
    if (this.isEditMode) {
      // alert('save first please');
      changes.month.currentValue = changes.month.previousValue;
    } else {
      this.initializeMonthForm();
    }
  }

  getPartsAssignableList() {
    const assignables = this.userService.getMidweekStudentsAssignableList(
      'midweek-students'
    );

    this.assignableList = assignables.list;
    this.assignableListByPart = assignables.byPart;
  }

  generateForm() {
    const weekForms = this.formBuilder.array([]);

    this.weeks.forEach((week, index) => {
      let position = 1;
      // TODO fetch from the db, from the epub
      const weekForm = {};
      this.listOfPartsByWeek[index].forEach((partName, partIndex) => {
        // Set the position for repetitive parts
        const previousPartName = this.listOfPartsByWeek[index][partIndex - 1];
        if (previousPartName === partName) {
          position = weekForm[partIndex - 1].get('position').value + 1;
        }
        weekForm[partIndex] = this.getPartForm(partName, week, position);
      });

      weekForms.push(this.formBuilder.group(weekForm));
    });

    this.monthForm = this.formBuilder.group({
      weeks: weekForms,
    });

    this.monthForm.disable(); // Disabled by default to prevent editing
  }

  /**
   * Build the individuals form/field for each part
   */
  getPartForm(
    partName: string,
    week: Interval,
    position: number = 1
  ): FormGroup {
    const partsForms = {
      bibleReading: this.formBuilder.group({
        week: week,
        part: this.bibleReadingPart._id,
        assignee: [''],
        position: position,
      }),
      initialCall: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.initialCallPart._id,
        assignee: [''],
        assistant: [''],
        position: position,
        title: 'A definir',
        number: 0,
      }),
      firstReturnVisit: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.firstReturnVisitPart._id,
        assignee: [''],
        assistant: [''],
        position: position,
      }),
      secondReturnVisit: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.secondReturnVisitPart._id,
        assignee: [''],
        assistant: [''],
        position: position,
      }),
      bibleStudy: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.bibleStudyPart._id,
        assignee: [''],
        assistant: [''],
        position: position,
      }),
      studentTalk: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.studentTalkPart._id,
        assignee: [''],
        position: position,
      }) as FormGroup,
    };

    return partsForms[partName];
  }

  /**
   * TODO Fetch them either from the epub or from jw.org.
   * Read the contract
   */
  getListOfPartsByWeek() {
    this.listOfPartsByWeek = [
      ['bibleReading', 'studentTalk'],
      ['bibleReading', 'initialCall', 'initialCall', 'initialCall'],
      ['bibleReading', 'firstReturnVisit', 'firstReturnVisit'],
      ['bibleReading', 'secondReturnVisit', 'bibleStudy'],
      ['bibleReading', 'secondReturnVisit', 'bibleStudy', 'bibleStudy'],
    ];
  }

  /**
   * Populate form, refresh and disable it
   */
  async populateForm() {
    // Refresh the list of users (to have their latests assignments up to date)
    // this.getPartsAssignableList();

    // Get stored values
    const midweekAssignments = await this.assignmentService.getAssignmentsByMeetingAndMonth(
      'midweek-students',
      this.month
    );

    // Populate form with stored values if there are
    const weekForms = this.monthForm.controls.weeks as FormArray;

    weekForms.controls.forEach((studentsForm: FormGroup, i) => {
      this.listOfPartsByWeek[i].forEach((partName, partIndex) => {
        // const partName = partNameFull.substr(0, partNameFull.indexOf('-'));

        const week = studentsForm.get([partIndex]).value.week;
        const position = studentsForm.get([partIndex]).value.position;

        if (midweekAssignments[week] !== undefined) {
          const partNameFull = this[partName + 'Part'].name;
          const partNameFullWithPosition = partNameFull + '-' + position;

          if (
            midweekAssignments[week][partNameFullWithPosition] !== undefined
          ) {
            // Type casting to remove TS errors
            ((this.monthForm.get('weeks') as FormArray).at(
              i
            ) as FormGroup).controls[partIndex].patchValue(
              midweekAssignments[week][partNameFullWithPosition]
            );
          }
        }
      });
    });
  }

  async saveForm(formData) {
    try {
      await this.assignmentService.upsertAssignments(
        formData,
        this.month.toFormat(this.settingService.getDateFormat('parseMonth'))
      );

      this._translate.get('assignment-save-success').subscribe((message) => {
        this.messageService.presentToast(message);
      });
    } catch (error) {
      throw error;
    }
  }
}
