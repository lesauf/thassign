import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { User } from '../../../models/users.schema';
// import { any } from '../../../../../../server/src/modules/users/user.schema';
import { PartService } from '../../../../core/services/part.service';
import { ValidationService } from '../../../../core/services/validation.service';

/**
 * User form generation
 */
@Injectable()
export class UserEditProvider implements OnInit {
  private manFieldsDisable: BehaviorSubject<Boolean> = new BehaviorSubject(
    false
  );
  private overseerFieldsDisable: BehaviorSubject<Boolean> = new BehaviorSubject(
    false
  );
  private form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private partService: PartService
  ) {}

  ngOnInit() {}

  initForm(user: any) {
    // If it is a woman, child, not publisher or unbaptized :
    // disable overseer fields
    this.setManFieldsDisable(user.genre === 'woman');

    this.setOverseerFieldsDisable(
      user.genre === 'woman' ||
        user.child === true ||
        user.baptized === false ||
        user.publisher === false
    );
  }

  setManFieldsDisable(val) {
    this.manFieldsDisable.next(val); // => true -> disabled
  }

  setOverseerFieldsDisable(val) {
    this.overseerFieldsDisable.next(val); // => true -> disabled
  }

  getManFieldsDisable() {
    return this.manFieldsDisable.asObservable();
  }

  getOverseerFieldsDisable() {
    return this.overseerFieldsDisable.asObservable();
  }
}
