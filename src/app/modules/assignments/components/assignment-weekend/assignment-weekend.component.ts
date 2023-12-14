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
  UntypedFormArray,
  FormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { DateTime, Interval } from 'luxon';
import { TranslateService } from '@ngx-translate/core';

import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
import { SettingService } from '@src/app/core/services/setting.service';
import { UserService } from '@src/app/modules/users/user.service';
import { ValidationService } from '@src/app/core/services/validation.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from '@src/app/core/models/part/part.model';

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
  selector: 'app-assignment-weekend',
  templateUrl: './assignment-weekend.component.html',
  styleUrls: ['./assignment-weekend.component.scss'],
})
export class AssignmentWeekendComponent
  extends AssignmentCommon
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  /**
   * Starting day of the month of this program
   */
  month: DateTime;

  @Output()
  editMode: EventEmitter<any> = new EventEmitter();

  /**
   * Selected value for this assignment
   */
  chairmanAssignment: Assignment;
  speakerAssignment: Assignment;
  conductorAssignment: Assignment;
  readerAssignment: Assignment;

  /**
   * Weekend Parts
   */
  chairmanPart: Part;
  speakerPart: Part;
  conductorPart: Part;
  readerPart: Part;

  constructor(
    protected assignmentService: AssignmentService,
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
    // assignmentService,
    // partService,
    // userService,
    // messageService,
    // formBuilder,
    // settingService,
    // _snackBar,
    // _translate,
    // validationService
  }

  async ngOnInit() {
    // this._getTranslations();
    // this.getWeekendAssignableList();
    // this.listOfParts = Object.keys(await this.partService.getPartsByMeeting('weekend'));
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.

    // TODO: set an alert to inform the users that he is still in edit mode
    // Emit edit mode event (to enable navigation)
    this.editMode.emit(false);
  }

  /**
   * Called whenever a data bound property is changed
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (this.chairmanPart === undefined) {
      // Fetch parts if not yet available
      await this.getParts('weekend');
    }

    // Check if the previous form was in edit mode
    if (this.isEditMode) {
      alert('save first please');
      // this.month = changes['month'].previousValue;
      changes['month'].currentValue = changes['month'].previousValue;
    } else {
      this.initializeMonthForm();
      // this.getFirstWeekOfTheSelectedMonth();

      // this.getAllWeeksOfTheSelectedMonth();

      // this.getListOfPartsByWeek();

      // // this.weekendForm.reset(); // ??

      // await this.getPartsAssignableList();

      // // Generate and populate the form with the values for the selected month
      // this.generateForm();

      // this.isEditMode = false;
    }
  }

  async getPartsAssignableList() {
    this.assignableList = await this.userService
      .getWeekendAssignableList()
      .toPromise();
  }

  generateForm() {
    const weekForms = this.formBuilder.array([]);

    this.weeks.forEach((week) => {
      weekForms.push(this.generateWeekendForm(week));
    });

    this.monthForm = weekForms;

    this.populateForm();

    this.monthForm.disable(); // Disabled by default to prevent editing
  }

  generateWeekendForm(week: Interval): UntypedFormGroup {
    const weekendForm = this.formBuilder.group({
      chairman: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.chairmanPart.name,
        assignee: [''],
      }),
      speaker: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.speakerPart.name,
        assignee: [''],
        title: 'A definir',
        number: 0,
      }),
      conductor: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.conductorPart.name,
        assignee: [''],
      }),
      reader: this.formBuilder.group({
        week: week.toFormat(DATE_FORMATS.store.dateInput),
        part: this.readerPart.name,
        assignee: [''],
      }),
    });

    return weekendForm as UntypedFormGroup;
  }

  getListOfPartsByWeek() {
    this.listOfPartsByWeek = [
      ['chairman', 'speaker', 'conductor', 'reader'],
      ['chairman', 'speaker', 'conductor', 'reader'],
      ['chairman', 'speaker', 'conductor', 'reader'],
      ['chairman', 'speaker', 'conductor', 'reader'],
      ['chairman', 'speaker', 'conductor', 'reader'],
    ];
  }

  /**
   * Populate form, refresh and disable it
   */
  async populateForm() {
    // Refresh the list of users (to have their latests assignments up to date)
    // this.getPartsAssignableList();

    // Get stored values
    const weekendAssignments = await this.assignmentService.getWeekendAssignmentsByMonth(
      this.month
    );

    // Populate form with stored values if there are
    const weekForms = this.monthForm.controls['weeks'] as UntypedFormArray;
    weekForms.controls.forEach((weekendForm: UntypedFormGroup, i) => {
      this.listOfParts.forEach((partName, partIndex) => {
        const week = weekendForm.controls[partName].value['week'];

        if (weekendAssignments[week] !== undefined) {
          if (
            weekendAssignments[week][this[partName + 'Part'].name] !== undefined
          ) {
            // Type casting to remove TS errors
            ((this.monthForm.get('weeks') as UntypedFormArray).at(
              i
            ) as UntypedFormGroup).controls[partName].patchValue(
              weekendAssignments[week][this[partName + 'Part'].name]
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
