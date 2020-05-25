import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { AssignmentDropdown } from '../../assignment-dropdown';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  @Input() assignment: Assignment;
  @Input() listOfParts: Part[];
  @Input() assignableListByPart: User[][];
  @Input() form: FormGroup;
  /**
   * Two-way data binding to update the assignments,
   * so that the values entered are not lost
   */
  @Input() assignments: Assignment[];
  @Output() assignmentsChange: EventEmitter<Assignment[]> = new EventEmitter();
  @Output() isRemoved: EventEmitter<Assignment> = new EventEmitter();

  ngOnInit(): void {
    this.form.valueChanges.subscribe((currentFormValues) => {
      this.assignmentsChange.emit(
        Assignment.fromJson(currentFormValues.assList) as Assignment[]
      );
    });
  }

  ngOnDestroy() {
    // this.form.valueChanges.()
  }

  get isValid() {
    return this.form.controls[this.assignment.key].valid;
  }

  removeAssignment() {
    this.isRemoved.emit(this.assignment);
  }

  /**
   * Used to set the value of Select list
   */
  compareFn(c1, c2): boolean {
    // console.log(c1);
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }
}
