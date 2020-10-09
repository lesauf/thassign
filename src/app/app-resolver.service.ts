import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';
import { Observable, EMPTY, of, combineLatest } from 'rxjs';
import { PartService } from '@src/app/core/services/part.service';
import { UserService } from '@src/app/modules/users/user.service';
import { AssignmentService } from '@src/app/modules/assignments/assignment.service';
import { AssignmentConverter } from '@src/app/core/models/assignment/assignment.converter';
import { BackendService } from '@src/app/core/services/backend.service';
import { AuthService } from '@src/app/modules/auth/auth.service';
import { UserConverter } from '@src/app/core/models/user/user.converter';

@Injectable({
  providedIn: 'root',
})
export class AppResolverService implements Resolve<string> {
  constructor(
    protected authService: AuthService,
    protected assignmentService: AssignmentService,
    protected partService: PartService,
    protected userService: UserService,
    protected backendService: BackendService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string {
    try {
      // const data = await this.backendService.callFunction('getData');

      // this.userService.destroy();
      // const allParts = this.partService.storeParts(data?.parts);

      // Set a listener on users collections
      const users$ = this.backendService
        .getQueryForCurrentUser('users')
        .valueChanges();

      // Set a listener on assignments collections
      const assignments$ = this.backendService
        .getQueryForCurrentUser('assignments', 'week')
        .valueChanges();

      combineLatest([users$, assignments$]).subscribe(
        ([users, assignments]) => {
          const parts = this.partService.getParts();

          // Handle assignments
          // COnvert first the users as User objects to populate the assignments
          const usersObjects = this.userService.createUser(
            users,
            parts
          ) as User[];

          const allAssignments = this.assignmentService.storeAssignments(
            assignments,
            parts,
            usersObjects
          );

          // Then store the users and pass them the converted assignments
          // I know, a bit twisted, but it works
          const allUsers = this.userService.storeUsers(
            users,
            this.partService.getParts(),
            allAssignments
          );

          // console.log('Updated data from DB: ', allUsers, allAssignments);
        }
      
      );

      return 'Data fetched';
    } catch (error) {
      throw error;
      // return error.message;
    }
  }
}
