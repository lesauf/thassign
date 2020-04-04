import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import * as Joi from 'joi-browser';
// const Joi = require('joi-browser');
/**
 * @see https://medium.com/@amcdnl/advanced-validation-with-angular-reactive-forms-2929759bf6e3
 * @see https://medium.com/@Yuschick/building-custom-localised-error-messages-with-joi-4a348d8cc2ba
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  /**
   * Wrapper that will map Joi errors to an Angular format
   */
  static joiValidator(schema): ValidatorFn {
    // const result = schema.validate(control.value);
    // if (result.error) {
    //   return result.error.details.reduce((obj, val, key) => {
    //     obj[val.type] = val.message;
    //     return obj;
    //   }, {});
    // }

    return (form: FormGroup): { [key: string]: any } | null => {
      const result = schema.validate(form.value, {
        abortEarly: false
      });

      let error = null;

      const fieldsWithError = {};
      if (result.error) {
        result.error.details.forEach(errorObj => {
          const field = errorObj.path.join('_');
          const type = errorObj.type;
          fieldsWithError[field] = `error.${field}.${type}`;
        });

        error = result.error.details.reduce((obj, val, key) => {
          obj[val.type] = val.message;
          return obj;
        }, {});
      }

      return error !== null ? fieldsWithError : null;
    };
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Required',
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        // tslint:disable-next-line:max-line-length
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex

    if (control.value === null || control.value === '') {
      // valid if empty
      return null;
    } else if (
      control.value.match(
        // tslint:disable-next-line:max-line-length
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  /**
   * Trigger validation on formFields
   */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
