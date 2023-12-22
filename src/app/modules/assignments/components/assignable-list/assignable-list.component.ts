import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySelectionList as MatSelectionList } from '@angular/material/legacy-list';
import { TranslateService } from '@ngx-translate/core';

import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { User } from '@src/app/core/models/user/user.model';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';

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

  constructor(
    private injector: Injector,
    protected assignmentService: AssignmentService,
    protected translateService: TranslateService
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.userList = this.data.options;

    // By default sort the users bay last assignments date
    this.sortByLastAssignmentDate();
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
        if (typeof a[field] === 'string') {
          // easier sort if strings
          return a[field].localeCompare(b[field]);
        } else {
          if (a[field] < b[field]) {
            return -1;
          }
          if (a[field] > b[field]) {
            return 1;
          }

          return 0;
        }
      });
    }
  }

  sortByLastAssignmentDate() {
    // Sort by last assignment date
    this.data.options.sort((a: User, b: User) => {
      // Sort by last assignment's date
      // nulls sort after anything else
      if (this.getUserLastAssignment(a) === undefined) {
        return -1;
      } else if (this.getUserLastAssignment(b) === undefined) {
        return 1;
      } else if (
        this.getUserLastAssignment(a).week.equals(
          this.getUserLastAssignment(b).week
        )
      ) {
        // equal items sort equally
        return 0;
      } else if (
        this.getUserLastAssignment(a).week < this.getUserLastAssignment(b).week
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
   * Get the assignments for part filtered by the current user
   *
   * Get those from assignmentsByUser, so they would
   * contain any assignment not yet saved to the DB
   *
   * @param user
   */
  getUserAssignments(user: User): Assignment[] {
    const assignmentsByUser = this.assignmentService.assignmentsByUser;

    return assignmentsByUser
      .get(user._id)
      .filter((a) => this.assignmentService.isWorkingOnPart(a.part));
  }

  /**
   * Get the last assignment
   * (or undefined if there are none)
   * @param user
   */
  getUserLastAssignment(user: User): Assignment {
    const userAss = this.getUserAssignments(user);

    if (userAss.length !== 0) {
      const index = userAss.length - 1;

      return userAss[index];
    }
  }

  getUserLastAssignmentNameTranslated(user: User) {
    const lastAssignment = this.getUserLastAssignment(user);
    if (lastAssignment.assignee._id === user._id) {
      return this.translateService.instant(lastAssignment.part.name);
    } else {
      // Assistant
      const partName = this.translateService.instant(lastAssignment.part.name);
      const assistant = this.translateService.instant('assistant');
      return `${partName} (${assistant})`;
    }
  }

  /**
   * Return the number of all the assignment of a user
   * @param user
   */
  getAssignmentsNumber(user: User): number {
    return this.getUserAssignments(user).length;
  }

  /**
   * TODO extract this to be used anywhere
   */
  getValueByDotNotation(obj, path) {
    return new Function('_', 'return _.' + path)(obj);
  }
}
