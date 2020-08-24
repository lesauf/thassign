import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '@src/app/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    // console.log('AuthGuard#canActivate called');
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
      // if (!this.backendService.getSignedInUser().customData.hasOwnProperty('_id')) {
      //   // I noticed that Custom data are empty on page reload ...
      //   // Refresh them manually
      //   this.authService.refreshCustomData();
      // }
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/auth/login']);
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}
