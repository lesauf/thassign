import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';
import { User } from '@src/app/core/models/user/user.model';

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
  constructor(private injector: Injector) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {}

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
      this.data.options.sort((a: User, b: User) => {
        // Sort by last assignment's date
        // nulls sort after anything else
        if (a.lastAssignment === null) {
          return -1;
        } else if (b.lastAssignment === null) {
          return 1;
        } else if (a.lastAssignment?.week === b.lastAssignment?.week) {
          // equal items sort equally
          return 0;
        } else if (a.lastAssignment?.week < b.lastAssignment?.week) {
          // otherwise, older sorts first
          return -1;
        } else {
          // recent sorts first
          return 1;
        }
      });
    } else if (field === 'assignmentsNumber') {
      // Sort by assignments number
      this.data.options.sort((a: User, b: User) => {
        if (a.assignments.length < b.assignments.length) {
          return -1;
        }
        if (a.assignments.length > b.assignments.length) {
          return 1;
        }

        return 0;
      });
    } else {
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

  /**
   * TODO extract this to be used anywhere
   */
  getValueByDotNotation(obj, path) {
    return new Function('_', 'return _.' + path)(obj);
  }
}
