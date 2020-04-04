import { Component, ElementRef, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-sort',
  templateUrl: './user-sort.component.html',
  styleUrls: ['./user-sort.component.scss']
})
export class UserSortComponent implements OnInit {
  private triggerElementRef: ElementRef;

  @Input()
  sort: string;
  // sortOrder: string;

  constructor(
    private _matDialogRef: MatDialogRef<UserSortComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { trigger: ElementRef; sort: string }
  ) {}

  ngOnInit() {
    //  Create the dialog and position it right under the notification button
    this.triggerElementRef = this.data.trigger;
    this.sort = this.data.sort;

    // Adjust the positioning and size of the dialog
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = {
      left: `${rect.left}px`,
      top: `${rect.bottom}px`
    };
    // matDialogConfig.width = '500px';
    matDialogConfig.height = '400px';
    // this._matDialogRef.updateSize(null, matDialogConfig.height);
    this._matDialogRef.updatePosition(matDialogConfig.position);
  }

  closeUserSort() {
    this._matDialogRef.close(this.sort);
  }
}
