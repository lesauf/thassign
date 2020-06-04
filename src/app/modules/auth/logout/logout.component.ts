import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: ['../auth.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.logout();
  }

  logout() {
    if (this.authService.isLoggedIn()) {
      const authedUser = this.authService.getUser();

      this.authService.logout();
      console.log(`successfully logged out`);

      const message = 'Logged out';
    }

    this.router.navigate(['/auth/login']);
  }
}
