import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssignmentDropdown } from '../../assignment-dropdown';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent {
  @Input() assignment: Assignment;
  @Input() form: FormGroup;

  get isValid() {
    return this.form.controls[this.assignment.key].valid;
  }

  /**
   * Used to set the value of Select list
   */
  compareFn(c1, c2): boolean {
    // console.log(c1);
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }
}
