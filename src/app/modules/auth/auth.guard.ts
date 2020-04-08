import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    console.log('AuthGuard#canActivate called');
    return this.checkLogin(url);

    // const user = (window as any).user;
    // if (user) {
    //   return true;
    // }

    // // not logged in so redirect to login page with the return url
    // this.router.navigate(['/auth/login']);
    // return false;
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      // return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/auth/login']);
    return false;
  }
}
