import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

import { StitchService } from 'src/app/core/services/stitch.service';
import { first } from 'rxjs/operators';
// import { userSchema } from 'src/app/core/models/user/user.schema';
import { User } from 'src/app/core/models/user/user.model';
import { validate } from 'class-validator';
import { RealmService } from 'src/app/core/services/realm.service';
// import { TooltipComponent } from '@angular/material/tooltip';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl = '';

  constructor(private backendService: RealmService) {}

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

    // Create user then authenticate him at one
    try {
      if (password !== repeatPassword) {
        throw 'Password does not match';
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
      user.userId = authedUser.id;
      console.log('Created: ', authedUser);

      // Save custom user data
      this.backendService.callFunction('Profiles_upsertCustomData', [user]);

      // Set the user data immediately since he is authenticated
      this.backendService.refreshCustomData();

      console.log('Logged :', this.backendService.getUser());
      // user.hashedPassword = password;
      // return await this.backendService.authenticate(email, password);
    } catch (error) {
      throw error;
    }
  }

  setUser(user) {}

  getUser() {
    return this.backendService.getUser();
  }

  me() {}

  logout(): void {
    this.backendService.logout();
  }
}
