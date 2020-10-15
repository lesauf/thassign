import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { User } from '@src/app/core/models/user/user.model';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { DateTime } from 'luxon';

/**
 * Display a list of assignable brothers to choose from for an assignment
 */
@Component({
  selector: 'app-assignable-list',
  templateUrl: './assignable-list.component.html',
  styleUrls: ['./assignable-list.component.scss'],
})
export class AssignableListComponent<T> implements OnInit {
  @ViewChild('options', { static: true }) options: MatSelectionList;

  public dialogRef = null;
  public data;

  public userList: User[];

  constructor(private injector: Injector, 
    protected assignmentService: AssignmentService,) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.userList = this.data.options;
  }

  closeDialog() {
    this.dialogRef.close({
      data: this.options.selectedOptions.selected[0].value,
    });
  }

  /**
   * Sort assignable list according to some fields
   */
  sort(field: string) {
    if (field === 'date') {
      // Sort by last assignment date
      this.sortByLastAssignmentDate();
    } else if (field === 'assignmentsNumber') {
      // Sort by assignments number
      this.sortByAssignmentsTotal();
    } else {
      // Sort by the given field
      this.data.options.sort((a: User, b: User) => {
        if (a[field] < b[field]) {
          return -1;
        }
        if (a[field] > b[field]) {
          return 1;
        }

        return 0;
      });
    }
  }

  sortByLastAssignmentDate() {
    // Sort by last assignment date
    this.data.options.sort((a: User, b: User) => {
      // Sort by last assignment's date
      // nulls sort after anything else
      if (this.getUserLastAssignmentDate(a) === undefined) {
        return -1;
      } else if (this.getUserLastAssignmentDate(b) === undefined) {
        return 1;
      } else if (this.getUserLastAssignmentDate(a).equals(this.getUserLastAssignmentDate(b))) {
        // equal items sort equally
        return 0;
      } else if (
        this.getUserLastAssignmentDate(a) < this.getUserLastAssignmentDate(b)
      ) {
        // otherwise, older sorts first
        return -1;
      } else {
        // recent sorts first
        return 1;
      }
    });
  }

  sortByAssignmentsTotal() {
    this.data.options.sort((a: User, b: User) => {
      if (this.getAssignmentsNumber(a) < this.getAssignmentsNumber(b)) {
        return -1;
      }
      if (this.getAssignmentsNumber(a) > this.getAssignmentsNumber(b)) {
        return 1;
      }

      return 0;
    });
  }

  /**
   * Get those from assignmentsByUser, so they would
   * contain any assignment not yet saved to the DB
   * @param user 
   */
  getUserAssignments(user: User): Assignment[] {
    const assignmentsByUser = this.assignmentService.assignmentsByUser;
    return assignmentsByUser.get(user._id);
  }

  /**
   * Return the number of all the assignment of a user
   * @param user 
   */
  getAssignmentsNumber(user: User): number {

    return this.getUserAssignments(user).length;
  }

  test() {
    console.log('test');
  }
  /**
   * Get the last assignments
   * @param user 
   */
  getUserLastAssignmentDate(user: User): DateTime {
    const userAss = this.getUserAssignments(user);

    if (userAss.length !== 0) {
      const index = userAss.length - 1 ;

      return userAss[index].week;
    }

  }

  /**
   * TODO extract this to be used anywhere
   */
  getValueByDotNotation(obj, path) {
    return new Function('_', 'return _.' + path)(obj);
  }
}
