import { Component, OnInit, Input, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from '@src/app/core/services/part.service';
// import { User } from '@src/app/core/models/user/user.schema';
import { UserService } from '@src/app/modules/users/user.service';
import { User } from '@src/app/core/models/user/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: 'user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  @Input()
  user: User;

  // partsNames: Array<string>;
  filteredPart: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private partService: PartService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: User }
  ) {}

  ngOnInit() {
    // alert('open');
    this.user = this.data.user;
    // if (!this.user) {
    //   this.router.navigate(['users']);
    // }
  }

  /**
   * Duplicate code from UserEditComponent.
   * @todo factor this
   */
  // getUser() {
  //   this.route.paramMap
  //     .pipe(
  //       switchMap(async (params: ParamMap) => {
  //         // if id param sent, pass it else pass a null param
  //         const id = params.get('id') ? params.get('id') : null;

  //         return await this.userService.getUser(id);
  //       }),
  //       defaultIfEmpty(undefined)
  //     )
  //     .subscribe((user) => {
  //       if (user === undefined) {
  //         // user not found. Redirect to users
  //         this.router.navigate(['users']);
  //         this.messageService.presentToast('user-not-found');
  //       } else {
  //         this.user = user;
  //       }
  //     });
  // }

  // getPartName(partName) {
  //   return this.partService.getPartName(partName);
  // }

  openUserEdit(): void {
    this.userService.currentUser = this.user;

    this.router.navigate(['/users/edit']);
  }
}
