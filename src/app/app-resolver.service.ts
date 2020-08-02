import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Part } from './core/models/part/part.model';
import { User } from './core/models/user/user.model';
import { Observable, EMPTY, of } from 'rxjs';
import { PartService } from './core/services/part.service';
import { UserService } from './modules/users/user.service';
import { AssignmentService } from './modules/assignments/assignment.service';
import { StitchService } from './core/services/stitch.service';
import { AuthService } from './modules/auth/auth.service';
import { RealmService } from './core/services/realm.service';

@Injectable({
  providedIn: 'root',
})
export class AppResolverService implements Resolve<string> {
  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private partService: PartService,
    private userService: UserService,
    private backendService: RealmService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<string> {
    try {
      const data = await this.backendService.callFunction('getData');

      // this.userService.destroy();
      const allParts = this.partService.storeParts(data.parts);
      const allUsers = this.userService.storeUsers(data.users, allParts);

      this.assignmentService.storeAssignments(
        data.assignments,
        allParts,
        allUsers
      );

      return 'Data fetched';
    } catch (error) {
      throw error;
      // return error.message;
    }
  }
}
