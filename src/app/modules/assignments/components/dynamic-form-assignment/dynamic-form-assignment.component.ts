import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssignmentDropdown } from '../../assignment-dropdown';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './dynamic-form-assignment.component.html',
  styleUrls: ['./dynamic-form-assignment.component.scss'],
})
export class DynamicFormAssignmentComponent {
  @Input() assignment: Assignment;
  @Input() form: FormGroup;

  get isValid() {
    return this.form.controls[this.assignment.key].valid;
  }
}
