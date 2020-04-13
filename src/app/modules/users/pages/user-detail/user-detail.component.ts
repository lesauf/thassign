import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, defaultIfEmpty } from 'rxjs/operators';

import { MessageService } from 'src/app/core/services/message.service';
import { PartService } from 'src/app/core/services/part.service';
// import { User } from 'src/app/core/models/user/user.schema';
import { UserService } from '../../user.service';

@Component({
  selector: 'user-detail',
  templateUrl: 'user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  user: any;
  partsNames: Array<string>;
  filteredPart: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private partService: PartService,
    private userService: UserService
  ) {}

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
      .subscribe((user) => {
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

  openUserEdit(ev: any) {}
}
