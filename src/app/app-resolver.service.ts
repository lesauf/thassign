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

@Injectable({
  providedIn: 'root',
})
export class AppResolverService implements Resolve<string> {
  constructor(
    private partService: PartService,
    private userService: UserService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<string> {
    try {
      // this.userService.destroy();
      await this.partService.fetchParts();
      await this.userService.fetchUsers();

      return 'Data fetched';
    } catch (error) {
      throw error;
      // return error.message;
    }
  }
}
