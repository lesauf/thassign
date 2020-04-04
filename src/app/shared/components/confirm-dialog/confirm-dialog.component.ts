import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationData {
  confirmationTitle: string;
  confirmationMessage: string;
  confirmationCancelButton: string;
  confirmationConfirmButton: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
/**
 * Operate in a popup
 * 1. ask for confirmation
 * 2. send a response back to the calling component with the answer
 */
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({ isConfirmed: true });
  }
}
