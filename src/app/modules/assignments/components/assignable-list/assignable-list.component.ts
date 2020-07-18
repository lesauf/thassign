import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { OptionsDialogComponent } from 'src/app/shared/components/options-dialog/options-dialog.component';

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
}
