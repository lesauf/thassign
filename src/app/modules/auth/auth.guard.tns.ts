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
import { Observable } from 'rxjs';

import { AuthService } from '@src/app/modules/auth/auth.service';

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
      firebase
        .getCurrentUser()
        .then((currentUser) => {
          if (currentUser != null) {
            resolve(true);
          } else {
            // if not connected redirect to auth page
            this.ngZone.run(() => {
              this.router
                .navigateByUrl('/auth')
                .then()
                .catch((error1) => {
                  console.log('AuthGuard: Redirect Error', error1);
                });
            });

            resolve(false);
          }
        })
        .catch((error) => {
          console.log('AuthGuard: getCurrentUser Error: ', error);
        });

      // firebase.addAuthStateListener({
      //   onAuthStateChanged: (data: firebase.AuthStateData) => {
      //     if (data.user) {
      //       console.log('User logged in: ' + data.user.email);
      //       this.authService.setUser({
      //         _id: data.user.uid,
      //         firstName: data.user.displayName,
      //         email: data.user.email,
      //         ownerId: data.user.uid,
      //       });
      //       // this.ngZone.run(() => {
      //       //   this.router.navigateByUrl('/home').then();
      //       // });
      //       resolve(true);
      //     } else {
      //       console.log('User not logged in');
      //       this.authService.setUser(null);
      //       this.ngZone.run(() => {
      //         this.router.navigateByUrl('/auth').then();
      //       });
      //       resolve(false);
      //     }
      //   },
      // });
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
