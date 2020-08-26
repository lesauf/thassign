import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  // implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fireAuth: AngularFireAuth
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const url: string = state.url;

    return new Promise((resolve, reject) => {
      this.fireAuth.authState.subscribe((user: firebase.User) => {
        if (user) {
          this.authService.setUser({
            _id: user.uid,
            firstName: user.displayName,
            email: user.email,
            ownerId: user.uid,
          });
          // console.log('Auth Changed', this.user);

          resolve(true);
        } else {
          this.authService.setUser(null);

          this.router.navigateByUrl('/auth');
          resolve(false);
        }
      });
    });

    // console.log('AuthGuard#canActivate called');
    // return await this.checkLogin(url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.fireAuth.authState.subscribe((user: firebase.User) => {
        if (user) {
          console.log('User is logged in');
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.router.navigateByUrl('/auth');
          resolve(false);
        }
      });
    });
  }

  async checkLogin(url: string): Promise<boolean> {
    try {
      // const userState = await this.authService.isLoggedIn();
      // console.log('Logged:', userState);

      // if (userState) {
      //   // if (!this.backendService.getSignedInUser().customData.hasOwnProperty('_id')) {
      //   //   // I noticed that Custom data are empty on page reload ...
      //   //   // Refresh them manually
      //   //   this.authService.refreshCustomData();
      //   // }
      //   return true;
      // }

      // Store the attempted URL for redirecting
      this.authService.redirectUrl = url;

      // Navigate to the login page with extras
      this.router.navigate(['/auth/login']);
      return false;
    } catch (error) {
      throw error;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}
