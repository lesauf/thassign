import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';
import { Observable, EMPTY, of } from 'rxjs';
import { PartService } from '@src/app/core/services/part.service';
import { UserService } from '@src/app/modules/users/user.service';
import { AssignmentService } from '@src/app/modules/assignments/assignment.service';
import { StitchService } from '@src/app/core/services/stitch.service';
import { AuthService } from '@src/app/modules/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppResolverService implements Resolve<string> {
  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private partService: PartService,
    private userService: UserService,
    private backendService: StitchService
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
