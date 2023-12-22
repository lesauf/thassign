import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormArray } from '@angular/forms';

import { AssignmentDropdown } from '@src/app/modules/assignments/models/assignment-dropdown.model';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';

@Injectable()
export class AssignmentControlService {
  constructor() {}

  toFormGroup(assignmentsByWeek: Assignment[][]) {
    const group: any = {};

    assignmentsByWeek.forEach((wAssignments, wIndex) => {
      const weekArray = [];

      wAssignments.forEach((assignment) => {
        // console.log(assignment);
        weekArray[assignment.position] = this.toAssignmentControl(assignment);
      });

      group[wIndex] = new UntypedFormArray(weekArray);
      // weekArray = [];
    });

    return new UntypedFormGroup(group);
  }

  toAssignmentControl(assignment: Assignment): UntypedFormGroup {
    return new UntypedFormGroup({
      week: new UntypedFormControl(assignment.week || ''),
      part: new UntypedFormControl(assignment.part || ''),
      assignee: new UntypedFormControl(assignment.assignee || ''),
      hall: new UntypedFormControl(assignment.hall || ''),
      ownerId: new UntypedFormControl(assignment.ownerId || ''),
      position: new UntypedFormControl(assignment.position),
      // ...(assignment.part?.withAssistant && {
      assistant: new UntypedFormControl(assignment.assistant || ''),
      // }),
      // ...(assignment.part?.withTitle && {
      title: new UntypedFormControl(assignment.title || ''),
      // }),
      // ...(assignment.number && {
      number: new UntypedFormControl(assignment.number || ''),
      // }),
    });
  }
}
