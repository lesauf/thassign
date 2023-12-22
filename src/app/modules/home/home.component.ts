import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { AuthService } from '@src/app/modules/auth/auth.service';
import { PartService } from '@src/app/core/services/part.service';
import { UserService } from '@src/app/modules/users/user.service';
import { ProgramService } from '@src/app/core/services/program.service';
import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  parts: Part[];

  users: User[];
  public users$: Observable<User[]>;

  assignments$: Observable<Assignment[]>;

  user: any;

  constructor(
    private assignmentService: AssignmentService,
    private authservice: AuthService,
    private partService: PartService,
    private programService: ProgramService,
    private userService: UserService
  ) {
    // const newUser = {
    //   firstName: 'trtr',
    //   // lastName: 'hghgh',
    //   email: 'lesauf@gmailcom',
    //   ownerId: this.authservice.getUser()._id,
    // };
    // const validation = userSchema.validate(newUser, { abortEarly: false });
    // this.user = validation.value as User;
    // console.log(validation);
    // // console.log(this.partService.getAllParts());
    // this.partService.getAllParts().then((parts) => {

    this.parts = this.partService.getParts();
    this.users$ = this.userService.data;
    this.assignments$ = this.assignmentService.data;
    // });
    // this.partService.getPartsNames().then((partsNames) => {
    //   console.log('Parts names :', partsNames);
    // });
  }

  ngOnInit() {
    // this.parts$ = this.partService.data;
    // this.users$ = this.userService.data;
  }

  addUser() {
    // this.userService.testOs();
  }

  logout() {
    this.authservice.logout();
  }
}
