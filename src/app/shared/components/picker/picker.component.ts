import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';
import { UntypedFormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

/**
 * Implementing the idea to replace select with modal picker with ampl space for options
 *
 * @link https://medium.com/@mibosc/responsive-design-why-and-how-we-ditched-the-good-old-select-element-bc190d62eff5
 *
 */
@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent<T> implements OnInit {
  /**
   * Component in charge of the display of list
   */
  @Input() optionsTemplate: any = OptionsDialogComponent; // ComponentType<T> | TemplateRef<T>;

  @Input() form: UntypedFormGroup;
  @Input() controlPath: string[];
  // @Input() controlName: string;
  @Input() placeholder: string;

  /**
   * Title of the dialog
   */
  @Input() title: string;

  /**
   * List of options
   */
  @Input() options: T[];

  /**
   * If options are objects, this will be the property used
   * to as label
   */
  @Input() labelField: string;

  // @Output() selectionDone: EventEmitter<T> = new EventEmitter();

  @Input() selectedValue: T;

  control: UntypedFormGroup;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.control = this.form.get(this.controlPath) as UntypedFormGroup;

    // console.log(this.optionsTemplate);
    if (!this.optionsTemplate) {
      // this.optionsTemplate = OptionsDialogComponent;
    }
  }

  openOptionsDialog() {
    const dialogRef = this.dialog.open(this.optionsTemplate, {
      data: {
        title: this.title,
        options: this.options,
        labelField: this.labelField,
      },
      height: '100%',
      position: {
        right: '0',
        top: '0',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Do not change the value if nothing was selected

        this.control.setValue(result.data);
      }
    });
  }
}
