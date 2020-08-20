import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[appConfirm]'
})
/**
 * Open a dialog to confirm the action
 */
export class ConfirmDirective {
  /**
   * Dialog title and directive selector
   */
  @Input('appConfirm') title: string;
  @Input() message: string;
  @Input() cancelButton: string;
  @Input() confirmButton: string;

  @Output()
  confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private _matDialog: MatDialog) {}

  @HostListener('click') onMouseEnter() {
    this.openConfirmationDialog();
  }

  private openConfirmationDialog() {
    // First display the confirmation dialog
    const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
      data: {
        confirmationTitle: this.title,
        confirmationMessage: this.message,
        confirmationCancelButton: this.cancelButton,
        confirmationConfirmButton: this.confirmButton
      }
    });
    // Then emit confirmed event if delete confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.confirmed.emit(true);
      }
    });
  }
}
