import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssignmentDropdown } from '../../assignment-dropdown';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent {
  @Input() assignment: Assignment;
  @Input() listOfParts: Part[];
  @Input() assignableListByPart: User[][];
  @Input() form: FormGroup;

  @Output() addAssignment: EventEmitter<Assignment> = new EventEmitter();

  get isValid() {
    return this.form.controls[this.assignment.key].valid;
  }

  setProperty<T>(property: string, value: T) {
    console.log(this.assignment);
    this.assignment[property] = value;
  }

  /**
   * Used to set the value of Select list
   */
  compareFn(c1, c2): boolean {
    // console.log(c1);
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }
}
