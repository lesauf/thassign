import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PartService } from 'src/app/core/services/part.service';
import { AuthService } from '../auth/auth.service';
import { Part } from 'src/app/core/models/part/part.model';
import { UserService } from '../users/user.service';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  parts$: Observable<Part[]>;

  users$: Observable<User[]>;

  user: any;

  constructor(
    private partService: PartService,
    private userService: UserService // private authservice: AuthService
  ) {
    // const newUser = {
    //   firstName: 'trtr',
    //   // lastName: 'hghgh',
    //   email: 'lesauf@gmailcom',
    //   ownerId: this.authservice.getUser().id,
    // };
    // const validation = userSchema.validate(newUser, { abortEarly: false });
    // this.user = validation.value as User;
    // console.log(validation);
    // // console.log(this.partService.getAllParts());
    // this.partService.getAllParts().then((parts) => {
    // this.parts = this.partService.allParts;
    // });
    // this.partService.getPartsNames().then((partsNames) => {
    //   console.log('Parts names :', partsNames);
    // });
  }

  ngOnInit() {
    this.users$ = this.userService.data;
    this.parts$ = this.partService.data;
  }

  addUser() {
    // this.userService.testOs();
  }
}
