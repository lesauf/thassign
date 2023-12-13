import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl } from '@angular/forms';
import { ValidationService } from '@src/app/core/services/validation.service';

@Injectable()
@Component({
  selector: 'app-control-messages',
  template: `
    <div *ngIf="errorMessage !== null" class="app-control-messages">
      <ul>
        <li *ngFor="let message of errorMessage">
          {{ message | translate }}
        </li>
      </ul>
    </div>
  `,

  styleUrls: ['control-messages.component.scss'],
})
/**
 * Handle the form validation and display of errors
 * @see https://coryrylan.com/blog/angular-form-builder-and-validation-management
 */
export class ControlMessagesComponent implements OnInit {
  @Input()
  control: UntypedFormControl;

  controlName: string;
  constructor() {}

  ngOnInit() {
    this.getControlNameFromParentForm();
  }

  get errorMessage() {
    const errors = this.control.parent.errors;
    // for (const propertyName in this.control.parent.errors) {
    if (
      errors &&
      errors.hasOwnProperty(this.controlName) &&
      this.control.touched
    ) {
      return errors[this.controlName];
    }
    // }

    return null;
  }

  getControlNameFromParentForm() {
    const formGroup = this.control.parent.controls;
    this.controlName =
      Object.keys(formGroup).find((name) => this.control === formGroup[name]) ||
      null;
  }
}
