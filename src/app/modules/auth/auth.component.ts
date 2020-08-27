import { Component, OnInit, Input, NgZone } from '@angular/core';
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
    repeatPassword: '',
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
    repeatPassword: {
      required: 'please retype your password',
      pattern: 'The password must contain numbers and letters',
      minlength: 'Please enter more than 6 characters',
      maxlength: 'Please enter less than 25 characters',
      passwordMatch: 'Password mismatch',
    },
  };

  isLoggingIn = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private authHelper: AuthHelper,
    private ngZone: NgZone
  ) {
    authHelper.configureMatIcon();
  }

  // email: string;
  // password: string;

  ngOnInit() {
    this.buildForm();
    // this.authHelper.hideActionBar();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.buildForm();
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
      ...(!this.isLoggingIn && {
        repeatPassword: ['a123456', [this.passwordsMatchValidator]],
      }),
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    // this.onValueChanged();
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

  async submit(provider) {
    try {
      switch (provider) {
        case 'emailPassword':
          if (this.isLoggingIn) {
            await this.login();
          } else {
            await this.signUp();
          }
          break;
        case 'google':
          await this.googleAuth();
          break;
      }

      this.router.navigate([this.authService.redirectUrl]);
      // this.router.navigate(['/home']);
      // this.ngZone.run(() => {
      //   this.router.navigateByUrl('/auto-generated').then();
      // });
    } catch (error) {
      this.isLoading = false;

      if (error.code === 'auth/email-already-in-use') {
        this.formMessages.email = 'error.email.string.already-in-use';
      } else if (error.code === 'auth/user-not-found') {
        this.formMessages.all = 'error.email.string.no-record';
      } else {
        this.formMessages.all = 'error.occurred';

        console.log(error.message, error);
      }
    }
  }

  async login(): Promise<void> {
    try {
      this.isLoading = true;

      await this.authService.emailLogin(
        this.userForm.value.email,
        this.userForm.value.password
      );

      console.log(`successfully logged in`);

      this.isLoading = false;
    } catch (error) {
      this.formMessages.all = error.message;
      throw error;
    }
  }

  async signUp() {
    // try {
    if (!this.userForm.valid) {
      return;
    }

    this.isLoading = true;

    const { email, password, repeatPassword } = this.userForm.getRawValue();

    const res = await this.authService.register(
      email,
      password,
      repeatPassword
    );

    this.isLoading = false;

    // this.router.navigate(['']);
    // } catch (error) {
    //   throw error;
    // }
  }

  async googleAuth() {
    try {
      await this.authService.googleLogin();
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.authService.logout();
    this.setMessage(
      'all',
      'Logged ' + (this.authService.isLoggedIn() ? 'in' : 'out')
    );
  }
}
