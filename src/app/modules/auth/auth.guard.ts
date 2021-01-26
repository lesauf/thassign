import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from '@angular/router';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '@src/app/modules/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
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

          resolve(true);
        } else {
          this.authService.setUser(null);

          this.router.navigateByUrl('/auth');
          resolve(false);
        }
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
