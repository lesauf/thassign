import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { AuthHelper } from '@src/app/modules/auth/auth-helper';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthHelper],
})
export class AuthComponent implements OnInit {
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

  isLoggingIn = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private loginHelper: AuthHelper
  ) {}

  // email: string;
  // password: string;

  ngOnInit() {
    this.buildForm();
    // this.loginHelper.hideActionBar();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  buildForm() {
    this.userForm = this.fb.group({
      email: [
        'brest@gmail.com',
        [
          Validators.required,
          // Validators.email
        ],
      ],
      password: [
        'a123456',
        [
          // Temporarily disable strong password
          // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
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

  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      alert('Login completed');
      this.router.navigate([this.authService.redirectUrl]);
    }, 2000);

    // this.authService
    //   .login(this.userForm.value.email, this.userForm.value.password)
    //   .then((authedUser) => {
    //     console.log(`successfully logged in`);
    //     alert(`successfully logged in`);
    //     this.isLoading = false;

    //     this.router.navigate([this.authService.redirectUrl]);
    //   })
    //   .catch((error) => {
    //     this.formMessages.all = error.message;
    //   });
  }

  signUp() {
    if (!this.userForm.valid) {
      return;
    }

    this.isLoading = true;

    const { email, password, repeatPassword } = this.userForm.getRawValue();

    setTimeout(() => {
      this.isLoading = false;
      alert('Signup completed');
    }, 2000);
    // this.authService
    //   .register(email, password, repeatPassword)
    //   .then((authedUser) => {
    //     this.isLoading = false;
    //     this.router.navigate(['']);
    //   });
  }

  logout() {
    this.authService.logout();
    this.setMessage(
      'all',
      'Logged ' + (this.authService.isLoggedIn() ? 'in' : 'out')
    );
  }
}
