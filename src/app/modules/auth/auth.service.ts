import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

import { validate } from 'class-validator';
import { BackendService } from '@src/app/core/services/backend.service';
import { CommonService } from '@src/app/core/services/common.service';
import { User } from '@src/app/core/models/user/user.model';
import { UserService } from '@src/app/modules/users/user.service';
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
    return this.backendService.isLoggedIn();
  }

  login(username: string, password: string): Promise<any> {
    return this.backendService.authenticate(username, password);
  }

  refreshCustomData() {
    return this.backendService.refreshCustomData();
  }

  async register(
    email: string,
    password: string,
    repeatPassword: string,
    firstname?: string,
    lastname?: string
  ): Promise<void> {
    // console.log('User: ', {
    //   email,
    //   password,
    //   repeatPassword,
    //   firstname,
    //   lastname,
    // });

    // Create user then authenticate him at one
    try {
      if (password !== repeatPassword) {
        throw new Error('Password does not match');
      }

      password = password; // Apply the hash here

      // save user data
      const user = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        hashedPassword: password,
        userId: '',
      };

      const validationErrors = await validate(user);

      if (validationErrors.length > 0) {
        throw validationErrors;
      }

      // Create user and authenticate at once to get his _id
      const authedUser = await this.backendService.createUserAccount(
        email,
        password
      );
      // Link the user data to stitch auth provider
      // user.userId = authedUser.id;
      // console.log('Created: ', authedUser);

      // Save custom user data
      // this.backendService.callFunction('Profiles_upsertCustomData', [user]);
      await this.userService.addUser(this.backendService.getSignedInUser());

      // Set the user data immediately since he is authenticated
      // this.backendService.refreshCustomData();

      console.log('Logged :', this.backendService.getSignedInUser());
      // user.hashedPassword = password;
      // return await this.backendService.authenticate(email, password);
    } catch (error) {
      throw error;
    }
  }

  setUser(user) {}

  getUser(): User {
    return this.backendService.getSignedInUser();
  }

  me() {}

  logout(): void {
    this.backendService.logout();
  }
}
