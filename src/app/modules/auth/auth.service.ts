import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Subject } from 'rxjs/Subject';

import { StitchService } from 'src/app/core/services/stitch.service';
// import { TooltipComponent } from '@angular/material/tooltip';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl = '';

  constructor(private stitchService: StitchService) {}

  isLoggedIn(): boolean {
    return this.stitchService.isLoggedIn();
  }

  login(email: string, password: string): Promise<any> {
    return this.stitchService.authenticate(email, password);
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    repeatPassword: string
  ) {}

  setUser(user) {}

  getUser() {
    return this.stitchService.getUser();
  }

  me() {}

  logout(): void {
    this.stitchService.logout();
  }
}
