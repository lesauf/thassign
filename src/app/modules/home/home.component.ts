import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AssignmentService } from '@src/app/modules/assignments/assignment.service';
import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { PartService } from 'src/app/core/services/part.service';
import { AuthService } from '@src/app/modules/auth/auth.service';
import { Part } from 'src/app/core/models/part/part.model';
import { UserService } from '@src/app/modules/users/user.service';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  parts: Part[];

  users: User[];

  assignments: Assignment[];

  user: any;

  constructor(
    private assignmentService: AssignmentService,
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
    this.parts = this.partService.getParts();
    this.users = this.userService.getUsers();
    this.assignments = this.assignmentService.getAssignments();
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
}
