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
import { BackendService } from '@src/app/core/services/backend.service';
import { AuthService } from '@src/app/modules/auth/auth.service';

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

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<string> {
    try {
      const data = await this.backendService.callFunction('getData');

      // this.userService.destroy();
      // const allParts = this.partService.storeParts(data?.parts);

      this.backendService.listenToCollection('users').subscribe((users) => {
        const allUsers = this.userService.storeUsers(
          users,
          this.partService.getParts()
        );
      });

      this.backendService
        .listenToCollection('assignments')
        .subscribe((assignments) => {
          this.assignmentService.storeAssignments(
            assignments,
            this.partService.getParts(),
            this.userService.getUsers()
          );
        });

      return 'Data fetched';
    } catch (error) {
      throw error;
      // return error.message;
    }
  }
}
