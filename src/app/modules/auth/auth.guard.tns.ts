import { Injectable, NgZone } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from '@angular/router';
import firebase from 'nativescript-plugin-firebase';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const url: string = state.url;

    return new Promise((resolve, reject) => {
      firebase.addAuthStateListener({
        onAuthStateChanged: (data: firebase.AuthStateData) => {
          if (data.user) {
            this.authService.setUser({
              _id: data.user.uid,
              firstName: data.user.displayName,
              email: data.user.email,
              ownerId: data.user.uid,
            });
            resolve(true);
          } else {
            this.authService.setUser(null);
            this.ngZone.run(() => {
              this.router.navigateByUrl('/auth').then();
            });
            resolve(false);
          }
        },
      });
    });
  }

  // async checkLogin(url: string): Promise<boolean> {
  //   try {
  //     // Store the attempted URL for redirecting
  //     this.authService.redirectUrl = url;

  //     // Navigate to the login page with extras
  //     this.router.navigate(['/auth/login']);
  //     return false;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}
