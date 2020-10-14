import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';

import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
import { SettingService } from '@src/app/core/services/setting.service';
import { UserService } from '@src/app/modules/users/user.service';
import { ValidationService } from '@src/app/core/services/validation.service';
import { Part } from '@src/app/core/models/part/part.model';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';

@Injectable()
export abstract class AssignmentCommon {
  editMode: any;

  /**
   * Starting day of the month of this program
   */
  month: DateTime;

  @ViewChild('printableArea')
  printable: ElementRef;

  /**
   * Used to generate the variables names
   */
  // listOfParts = ['chairman', 'speaker', 'conductor', 'reader'];
  listOfParts: Part[];

  /**
   * List of parts for each week
   * Useful in case theses are different each week
   */
  // listOfPartsByWeek: any[] = [];

  /**
   * Form for assignments for the whole month
   */
  monthForm: FormArray;

  /**
   * Edit mode, useful for disabling the month selector
   */
  isEditMode = false;

  firstWeekOfTheMonth: Interval;

  /**
   * List of user assignable to parts (not disabled nor deleted)
   */
  assignableList: any[];

  /**
   * List of user assignable grouped by parts (not disabled nor deleted)
   */
  assignableListByPart: any[];

  /**
   * List of all the weeks of the selected month
   */
  weeks: Interval[];

  meetingName: string;

  assignmentsByWeek: Assignment[][] = [];

  protected assignmentService: AssignmentService;
  protected partService: PartService;
  protected userService: UserService;
  protected messageService: MessageService;
  protected formBuilder: FormBuilder;
  protected settingService: SettingService;
  protected _snackBar: MatSnackBar;
  protected _translate: TranslateService;
  protected validationService: ValidationService;

  constructor() {
    // this.assignmentService = assignmentService;
    // this.partService = partService;
    // this.userService = userService;
    // this.messageService = messageService;
    // this.formBuilder = formBuilder;
    // this.settingService = settingService;
    // this._snackBar = _snackBar;
    // this._translate = _translate;
    // this.validationService = validationService;
  }

  /**
   * Get some initial data :
   * - assignables users by part
   */
  async initializeData() {
    // Get the list of users assignable to parts
    const assignables = this.userService
      .getAssignableUsersByParts
      // this.listOfParts,
      // this.meetingName
      ();

    this.assignableList = assignables.list;
    this.assignableListByPart = assignables.byPart;

    this.isEditMode = false;
  }

  /**
   * Get current month specific data
   * - firstWeekOfTheMonth
   * - weeks of the current month
   */
  initializeMonthData() {
    // Convert the month to the first day of the week
    this.firstWeekOfTheMonth = this.assignmentService.getFirstWeekOfTheSelectedMonth(
      this.month
    ); // populate this.firstWeekOfMonth

    this.weeks = this.assignmentService.getAllWeeksOfTheSelectedMonth(
      this.month
    );
  }

  setEditMode(value: boolean) {
    this.isEditMode = value;

    this.editMode.emit(value);
  }

  /**
   * Get parts of a meeting
   */
  async getParts() {
    this.listOfParts = await this.partService.getPartsByMeeting(
      this.meetingName
    );

    // const partsShortNames = Object.keys(this.listOfParts);

    // partsShortNames.forEach((partName) => {
    //   this[partName + 'Part'] = this.listOfParts[partName];
    //   // console.log(this[partName + 'Part']);
    // });
  }

  /**
   *  Get the part name (translatable title) from the part object
   */
  getPartTitle(partName) {
    return this[partName + 'Part'].name;
  }

  /**
   * Populate form, refresh and disable it
   */
  // abstract populateForm();

  /**
   * Handle the request to the db with the data to save
   */
  // abstract saveForm(formData);

  /**
   * Enable and handle the validation and save of the form
   */
  // editAndSaveForm() {
  //   // If the form is disabled, enable it and
  //   // activate edit mode
  //   if (this.monthForm.disabled) {
  //     this.isEditMode = true;
  //     this.monthForm.enable();
  //   } else {
  //     // Form enabled, so save it, disable edit mode
  //     // and disable the form

  //     // trigger validation
  //     this.validationService.validateAllFormFields(this.monthForm);

  //     if (this.monthForm.valid) {
  //       // Make sure to create a deep copy of the form-model
  //       const formData = this.monthForm.value;

  //       // Do useful stuff with the gathered data
  //       this.saveForm(formData);
  //     } else {
  //       // this.showAlert();
  //     }

  //     const saveSuccess = true;

  //     if (saveSuccess) {
  //       this.isEditMode = false;
  //       this.monthForm.disable();
  //       this.populateForm(); // Refresh the form
  //     }
  //   }

  //   // Emit edit mode event (to disable navigation)
  //   this.editMode.emit(this.isEditMode);
  // }

  /**
   * Reset form and enable navigation
   */
  // cancelForm() {
  //   // this.monthForm.reset();
  //   this.populateForm();
  //   // this.studentsForm.disable();
  //   this.isEditMode = false;

  //   // Emit edit mode event (to disable navigation)
  //   this.editMode.emit(this.isEditMode);
  // }

  /**
   * Auto generate the empty assignments
   */
  async generateAssignmentsOld() {
    //   // Get the error messages
    //   const noAssignableUserMessage = await this._translate
    //     .get('part-with-no-assignable-user')
    //     .toPromise();
    //   const noAssignableUserAction = await this._translate
    //     .get('part-with-no-assignable-user-action')
    //     .toPromise();
    //   console.log(this.assignableList['initialCall']);
    //   // Get the values in the form
    //   // parse the weeks
    //   this.monthForm.value.weeks.forEach((weekValues, weekIndex) => {
    //     // Handle each field
    //     this.listOfPartsByWeek[weekIndex].forEach((partName, partIndex) => {
    //       const assignee = this.assignableList[partName][0];
    //       // Handle only the field unassigned.
    //       // This way the user can do some and generate the rest
    //       if (weekValues[partIndex] && !weekValues[partIndex]['assignee']) {
    //         // No user assigned, so we will assign the first in the list
    //         const week = weekValues[partIndex]['week'];
    //         if (this.assignableList[partName].length) {
    //           // If there are assignable users
    //           const indexToAssign = this.assignableList[partName].keys();
    //           if (partIndex !== 0) {
    //             const previousPartIndex = partIndex - 1;
    //             // Compare the value in the previous field
    //             while (
    //               this.monthForm.get([
    //                 'weeks',
    //                 weekIndex,
    //                 previousPartIndex,
    //                 'assignee'
    //               ]).value['_id'] === this.assignableList[partName][0]['_id']
    //             ) {
    //               // If same, rotate the list of this field
    //               this.rotateArray(this.assignableList[partName]);
    //             }
    //           }
    //           this.monthForm
    //             .get(['weeks', weekIndex, partIndex, 'assignee'])
    //             .setValue(assignee);
    //           // Now lets rotate the list
    //           this.rotateArray(this.assignableList[partName]);
    //         } else {
    //           // TODO inform the users that there are empty assignables for some parts
    //           // Use snackbar notification ?
    //           this._snackBar.open(
    //             noAssignableUserMessage,
    //             noAssignableUserAction
    //           );
    //         }
    //       }
    //     });
    //   });
    //   // Enable the form for adjustment and save
    //   this.monthForm.disable();
    //   this.editAndSaveForm();
  }

  /**
   * Kind of rotating array, this way the users are assigned by order
   */
  _getFirstAssignableUserForPartAndMoveHimDown(partName) {
    // Get the index of the first user assignable to this part
    const assignableUserIndex = this.assignableList.findIndex((user) => {
      return (
        user.parts.find(
          // partName is just the short name, so we need to get the db name
          (part) => part.name === this.listOfParts[partName].name
        ) !== undefined
      );
    });

    if (assignableUserIndex !== -1) {
      // User found
      // Remove the user from the list
      const assignableUser = this.assignableList.splice(assignableUserIndex, 1);
      // Put him at the end
      this.assignableList.push(assignableUser[0]);
      // console.log(assignableUser);
      return assignableUser[0];
    }
  }

  // async generateAssignments() {
  //   // Get the error messages
  //   const noAssignableUserMessage = await this._translate
  //     .get('part-with-no-assignable-user')
  //     .toPromise();
  //   const noAssignableUserAction = await this._translate
  //     .get('part-with-no-assignable-user-action')
  //     .toPromise();

  //   // console.log(this.assignableList);

  //   // Get the values in the form
  //   // parse the weeks
  //   this.monthForm.value.weeks.forEach((weekValues, weekIndex) => {
  //     // Handle each field
  //     this.listOfPartsByWeek[weekIndex].forEach((partName, partIndex) => {
  //       const assignee = this._getFirstAssignableUserForPartAndMoveHimDown(
  //         partName
  //       );

  //       // Handle only the field unassigned.
  //       // This way the user can assign some and generate the rest
  //       if (weekValues[partIndex] && !weekValues[partIndex]['assignee']) {
  //         // No user assigned, so we will assign the first in the list
  //         const week = weekValues[partIndex]['week'];

  //         if (assignee !== undefined) {
  //           // If there is an assignable user

  //           // if (partIndex !== 0) {
  //           //   const previousPartIndex = partIndex - 1;

  //           //   // Compare the value in the previous field
  //           //   if (
  //           //     this.monthForm.get([
  //           //       'weeks',
  //           //       weekIndex,
  //           //       previousPartIndex,
  //           //       'assignee'
  //           //     ]).value['_id'] === assignee['_id']
  //           //   ) {
  //           //     console.log('Avant', assignee);
  //           //     // If same, pick the next user (done just once, for now)
  //           //     assignee = this._getFirstAssignableUserForPartAndMoveHimDown(
  //           //       partName
  //           //     );
  //           //     console.log('Apres', assignee);
  //           //   }
  //           // }

  //           this.monthForm
  //             .get(['weeks', weekIndex, partIndex, 'assignee'])
  //             .setValue(assignee);

  //           // Assign the assistant
  //           if (this.listOfParts[partName].withAssistant) {
  //             const assistant = this._getFirstAssignableUserForPartAndMoveHimDown(
  //               'studentAssistant'
  //             );

  //             this.monthForm
  //               .get(['weeks', weekIndex, partIndex, 'assistant'])
  //               .setValue(assistant);
  //           }
  //         } else {
  //           // TODO inform the users that there are empty assignables for some parts
  //           // Use snackbar notification ?
  //           this._snackBar.open(
  //             noAssignableUserMessage,
  //             noAssignableUserAction
  //           );
  //         }
  //       }
  //     });
  //   });
  //   // console.log(this.monthForm);
  //   // Enable the form for adjustment and save
  //   this.monthForm.disable();
  //   //  this.editAndSaveForm();
  // }

  /**
   * Rotate and array, sending the first elt to the end
   */
  rotateArray(array: any[]) {
    // array.shift();
    // console.log('Avant', array);
    // const shifted = array.shift();
    // console.log(shifted);
    array.push(array.shift());
    // console.log('Apres', array);
    return array;
  }

  /**
   * Used to set the value of Select list
   */
  // compareFn(c1, c2): boolean {
  //   // console.log(c1);
  //   return c1 && c2 ? c1._id === c2._id : c1 === c2;
  // }

  /**
   * Sort the list of brothers by lastName
   * @param field string
   * sortOrder
   */
  sortUsersByName(field: string, sortOrder: string = 'asc') {
    const fieldCombinedName = `${field}AssigneeList`;

    this[fieldCombinedName] = this[fieldCombinedName].sort((a, b) => {
      if (a.fullName > b.fullName) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      if (a.fullName < b.fullName) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  sortUsersByLastAssignment(
    field: string,
    sortOrder: string = 'asc',
    partName?: string
  ) {
    const fieldCombinedName = `${field}AssigneeList`;
    let aLastAssignment;
    let bLastAssignment;
    this[fieldCombinedName] = this[fieldCombinedName].sort((a, b) => {
      let sortValue = 0;
      // If a part is specified, search instead for its last assignment
      aLastAssignment =
        partName === undefined
          ? a.lastAssignmentAnyPart
          : a.lastAssignmentThisPart;
      bLastAssignment =
        partName === undefined
          ? b.lastAssignmentAnyPart
          : b.lastAssignmentThisPart;

      switch (
        [aLastAssignment === undefined, bLastAssignment === undefined].join(' ')
      ) {
        case 'true true':
          // Both have not this assignment they are on par
          sortValue = 0;
          break;
        case 'true false':
          // The one with no assignment come first
          sortValue = sortOrder === 'asc' ? -1 : 1;
          break;
        case 'false true':
          // The one with no assignment come first
          sortValue = sortOrder === 'asc' ? 1 : -1;
          break;
        default:
          // case 'false false':
          // Both have this assignment
          if (aLastAssignment.week > bLastAssignment.week) {
            sortValue = sortOrder === 'asc' ? 1 : -1;
          } else if (aLastAssignment.week < bLastAssignment.week) {
            sortValue = sortOrder === 'asc' ? -1 : 1;
          } else {
            sortValue = 0;
          }
          break;
      }

      return sortValue;
    });
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

  /**
   * @todo build a service for that, or find a way to factorize it
   * to be used in the whole app.
   * Or better, use a pipe !
   */
  formatDate(date: Date) {
    return DateTime.fromJSDate(date).toFormat('Y-M-D');
  }
}
