import { Component, OnInit, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';
import { FormGroup } from '@angular/forms';
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
  @Input() component: ComponentType<any> = OptionsDialogComponent;

  @Input() form: FormGroup;
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
  @Input() options: any[] = [
    { label: 'Option 1' },
    { label: 'Option 2' },
    { label: 'Option 3' },
  ];

  /**
   * If options are objects, this will be the property used
   * to as label
   */
  @Input() labelField: string;

  // @Output() selectionDone: EventEmitter<T> = new EventEmitter();

  @Input() selectedValue: T;

  control: FormGroup;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.control = this.form.get(this.controlPath) as FormGroup;
  }

  openOptionsDialog() {
    const dialogRef = this.dialog.open(this.component, {
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
