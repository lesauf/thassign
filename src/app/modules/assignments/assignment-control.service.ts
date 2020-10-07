import { Injectable } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { AssignmentDropdown } from '@src/app/modules/assignments/assignment-dropdown';
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

      group[wIndex] = new FormArray(weekArray);
      // weekArray = [];
    });

    return new FormGroup(group);
  }

  toAssignmentControl(assignment: Assignment): FormGroup {
    return new FormGroup({
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
      // ...(assignment.number && {
      number: new FormControl(assignment.number || ''),
      // }),
    });
  }
}
