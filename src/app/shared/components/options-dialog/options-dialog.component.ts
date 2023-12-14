import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySelectionList as MatSelectionList } from '@angular/material/legacy-list';

@Component({
  selector: 'app-options-dialog',
  templateUrl: './options-dialog.component.html',
  styleUrls: ['./options-dialog.component.scss'],
})
export class OptionsDialogComponent<T> implements OnInit {
  @ViewChild('options', { static: true }) options: MatSelectionList;

  constructor(
    public dialogRef: MatDialogRef<OptionsDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({
      data: this.options.selectedOptions.selected[0].value,
    });
  }

  test() {
    console.log('test');
  }
}
