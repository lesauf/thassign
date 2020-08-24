import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { BackendService } from '@src/app/core/services/backend.service';

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: ['../auth.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit() {
    this.logout();
  }

  logout() {
    if (this.authService.isLoggedIn()) {
      const authedUser = this.backendService.getSignedInUser();

      this.authService.logout();
      console.log(`successfully logged out`);

      const message = 'Logged out';
    }

    this.router.navigate(['/auth/login']);
  }
}
