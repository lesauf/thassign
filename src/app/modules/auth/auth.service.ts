import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

import { StitchService } from 'src/app/core/services/stitch.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/shared/models/users.schema';
// import { TooltipComponent } from '@angular/material/tooltip';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl = '';

  constructor(private stitchService: StitchService) {}

  isLoggedIn(): boolean {
    return this.stitchService.isLoggedIn();
  }

  login(username: string, password: string): Promise<any> {
    return this.stitchService.authenticate(username, password);
  }

  async register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    repeatPassword: string
  ): Promise<any> {
    console.log('User: ', {
      firstname,
      lastname,
      email,
      password,
      repeatPassword,
    });

    // Create user then authenticate him at one
    try {
      // Create user and authenticate at once
      await this.stitchService.createUserAccount(email, password);

      // save user data
      const user = new User();
      user.firstName = firstname;
      user.lastName = lastname;
      user.email = email;
      // user.hashedPassword = password;
      // return await this.stitchService.authenticate(email, password);
      return Promise.resolve(true);
    } catch (error) {
      throw error;
    }
  }

  setUser(user) {}

  getUser() {
    return this.stitchService.getUser();
  }

  me() {}

  logout(): void {
    this.stitchService.logout();
  }
}
