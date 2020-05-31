import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input() message: string;

  userForm: FormGroup;
  formMessages = {
    all: '',
    email: '',
    password: '',
  };
  validationMessages = {
    email: {
      required: 'Please enter your email',
      email: 'please enter your vaild email',
    },
    password: {
      required: 'please enter your password',
      pattern: 'The password must contain numbers and letters',
      minlength: 'Please enter more than 6 characters',
      maxlength: 'Please enter less than 25 characters',
    },
  };

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  // email: string;
  // password: string;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      email: [
        'lesauf',
        [
          Validators.required,
          // Validators.email
        ],
      ],
      password: [
        'password',
        [
          // Temporarily disable strong password
          // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25),
        ],
      ],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  setMessage(type: string, message: string) {
    this.formMessages[type] = message;
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

  login(): void {
    this.authService
      .login(this.userForm.value.email, this.userForm.value.password)
      .then((authedUser) => {
        console.log(`successfully logged in`);

        this.router.navigate([this.authService.redirectUrl]);
      })
      .catch((error) => {
        this.formMessages.all = error.message;
      });
  }

  logout() {
    this.authService.logout();
    this.setMessage(
      'all',
      'Logged ' + (this.authService.isLoggedIn() ? 'in' : 'out')
    );
  }
}
