import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

import { first } from 'rxjs/operators';
// import { userSchema } from '@src/app/core/models/user/user.schema';
import { User } from '@src/app/core/models/user/user.model';
import { validate } from 'class-validator';
import { BackendService } from '@src/app/core/services/backend.service.tns';
import { UserService } from '@src/app/modules/users/user.service';
import { CommonService } from '@src/app/core/services/common.service';
// import { TooltipComponent } from '@angular/material/tooltip';

@Injectable()
export class AuthService extends CommonService<User> {
  // store the URL so we can redirect after logging in
  redirectUrl = '';

  constructor(
    protected backendService: BackendService,
    protected userService: UserService
  ) {
    super();
  }

  isLoggedIn(): boolean {
    return false;
  }

  login(username: string, password: string): Promise<any> {
    return new Promise(() => {});
  }

  refreshCustomData() {
    return false;
  }

  async register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    repeatPassword: string
  ): Promise<void> {
    console.log('User: ', {
      firstname,
      lastname,
      email,
      password,
      repeatPassword,
    });
  }

  setUser(user) {}

  getUser() {
    return { id: null, customData: {} };
  }

  me() {}

  logout(): void {}
}
