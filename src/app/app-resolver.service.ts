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

@Injectable({
  providedIn: 'root',
})
export class AppResolverService implements Resolve<string> {
  constructor(
    private assignmentService: AssignmentService,
    private partService: PartService,
    private userService: UserService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<string> {
    try {
      // this.userService.destroy();
      const allParts = await this.partService.fetchParts();
      const allUsers = await this.userService.fetchUsers(allParts);

      await this.assignmentService.fetchAssignments(allParts, allUsers);

      return 'Data fetched';
    } catch (error) {
      throw error;
      // return error.message;
    }
  }
}
