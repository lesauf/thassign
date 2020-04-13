import { Component } from '@angular/core';
import { validate } from 'class-validator';

import { PartService } from 'src/app/core/services/part.service';
import { userSchema } from 'src/app/core/models/user/user.schema';
import { AuthService } from '../auth/auth.service';
import { Part } from 'src/app/core/models/part/part.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  public parts: any;

  user: any;

  constructor(
    public partService: PartService,
    public authservice: AuthService
  ) {
    const part: Part = new Part();
    part.name = 'test';
    part.withAssistant = true;

    console.log('PART:', validate(part));

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
    //   this.parts = parts;
    //   console.log(parts);
    // });

    // this.partService.getPartsNames().then((partsNames) => {
    //   console.log('Parts names :', partsNames);
    // });
  }
}
