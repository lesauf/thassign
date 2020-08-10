import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';

import { AuthService } from '@src/app/modules/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  formMessages = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  };
  validationMessages = {
    firstName: {
      required: 'Please enter your first name',
    },
    lastName: {
      required: 'Please enter your last name',
    },
    email: {
      required: 'Please enter your email',
      email: 'Please enter your valid email address',
    },
    password: {
      required: 'Please enter your password',
      pattern: 'The password must contain numbers and letters',
      minlength: 'Please enter more than 6 characters',
      maxlength: 'Please enter less than 25 characters',
    },
    repeatPassword: {
      required: 'please retype your password',
      pattern: 'The password must contain numbers and letters',
      minlength: 'Please enter more than 6 characters',
      maxlength: 'Please enter less than 25 characters',
      passwordMatch: 'Password mismatch',
    },
  };

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25),
        ],
      ],
      repeatPassword: ['', [Validators.required, this.passwordsMatchValidator]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    const password = control.root.get('password');
    return password && control.value !== password.value
      ? {
          passwordMatch: true,
        }
      : null;
  }

  // userForm = new FormGroup({
  //   fullname: new FormControl('', [Validators.required]),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required]),
  //   repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  // })

  get firstName(): any {
    return this.userForm.get('firstName');
  }
  get lastName(): any {
    return this.userForm.get('lastName');
  }
  get email(): any {
    return this.userForm.get('email');
  }
  get password(): any {
    return this.userForm.get('password');
  }
  get repeatPassword(): any {
    return this.userForm.get('repeatPassword');
  }

  /**
   * Display error messages as the user type
   */
  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formMessages) {
      if (Object.prototype.hasOwnProperty.call(this.formMessages, field)) {
        this.formMessages[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formMessages[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  register() {
    if (!this.userForm.valid) {
      return;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
    } = this.userForm.getRawValue();

    this.authService
      .register(firstName, lastName, email, password, repeatPassword)
      .then((authedUser) => {
        this.router.navigate(['']);
      });
  }
}
