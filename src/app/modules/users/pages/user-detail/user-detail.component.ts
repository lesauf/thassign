import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, defaultIfEmpty } from 'rxjs/operators';

import { User } from '../../../../shared/models/users.schema';
import { MessageService } from '../../../../core/services/message.service';
import { PartService } from '../../../../core/services/part.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'user-detail',
  templateUrl: 'user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  user: User;
  partsNames: Array<string>;
  filteredPart: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private partService: PartService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUser();

    this.getPartsNames();
  }

  getUser() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.userService.getUser(params.get('id'), true)
        ),
        defaultIfEmpty(undefined)
      )
      .subscribe(user => {
        if (user === undefined) {
          // user not found. Redirect to users
          this.router.navigate(['users']);
          this.messageService.presentToast('user-not-found');
        } else {
          this.user = user;
        }
      });
  }

  getPartsNames() {
    return this.partService.getPartsNames();
  }

  openUserEdit(ev: any) {
  }
}
