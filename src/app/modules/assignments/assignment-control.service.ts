import { Injectable } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { AssignmentDropdown } from './assignment-dropdown';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';

@Injectable()
export class AssignmentControlService {
  constructor() {}

  toFormGroup(assignments: Assignment[]) {
    let group: any = {};

    assignments.forEach((assignment) => {
      group[assignment.key] = new FormGroup({
        _id: new FormControl(assignment._id || ''),
        week: new FormControl(assignment.week || ''),
        part: new FormControl(assignment.part || ''),
        assignee: new FormControl(assignment.assignee || ''),
        hall: new FormControl(assignment.hall || ''),
        ownerId: new FormControl(assignment.ownerId || ''),
        createdAt: new FormControl(assignment.createdAt),
        deleted: new FormControl(assignment.deleted),
        ...(assignment.assistant && {
          assistant: new FormControl(assignment.assistant || ''),
        }),
        ...(assignment.title && {
          title: new FormControl(assignment.title || ''),
        }),
        ...(assignment.number && {
          number: new FormControl(assignment.number || ''),
        }),
        ...(assignment.updatedAt && {
          updatedAt: new FormControl(assignment.updatedAt),
        }),
        ...(assignment.deletedAt && {
          deletedAt: new FormControl(assignment.deletedAt),
        }),
        ...(assignment.deletedBy && {
          deletedBy: new FormControl(assignment.deletedBy),
        }),
      });
    });

    return new FormGroup(group);
  }
}
