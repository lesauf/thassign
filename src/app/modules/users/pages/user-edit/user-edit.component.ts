import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  NgZone,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, defaultIfEmpty } from 'rxjs/operators';

import { ControlMessagesComponent } from '../../../../shared/components/control-messages/control-messages.component';
import { UserEditProvider } from './user-edit.provider';

// import { any } from '../../../../../../server/src/modules/parts/part.model';
// import { Part } from '../../../models/parts.schema';
// import { UserModel } from '../../../../../server/src/modules/users/user.model';
import { User } from 'src/app/core/models/user/user.model';
import { ValidationService } from '../../../../core/services/validation.service';
import { PartService } from 'src/app/core/services/part.service';
import { UserService } from '../../user.service';
import { MessageService } from '../../../../core/services/message.service';
import { Part } from 'src/app/core/models/part/part.model';
// import { translate } from './../../utils/common';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UserEditProvider],
})
export class UserEditComponent implements OnInit {
  /**
   * User on which we are working, creating or editing
   */
  user: any;

  /**
   * List of all available parts
   */
  allParts: Part[];

  /**
   * All parts grouped by meeting
   */
  allPartsGrouped$: Promise<{ parts: any; meetings: any }>;

  controlMessagesComponent: ControlMessagesComponent;

  @Output()
  userEdited = new EventEmitter<object>();
  selectedUser: any;
  userForm: FormGroup;
  overseerFieldsDisabled: boolean;
  manFieldsDisabled: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private alertController: popoverController,
    private messageService: MessageService,
    public validationService: ValidationService,
    private partService: PartService,
    private translate: TranslateService,
    private userService: UserService,
    private userEditProvider: UserEditProvider
  ) {}

  // controlMessagesComponent: ControlMessagesComponent
  /**
   * @see https://ultimatecourses.com/blog/angular-ngif-async-pipe
   */
  ngOnInit() {
    // this.getUser();
    this.user = this.userService.currentUser;

    if (!this.user) {
      this.router.navigate(['users']);
      // Switch to addUser form
      // this.user = await this.userService.getUser();
    }

    this.getUserForm();
    this.allParts = this.partService.getParts();

    this.allPartsGrouped$ = this.partService.getPartsGroupedByMeeting();
    this.controlMessagesComponent = new ControlMessagesComponent();
  }

  getUserForm(): void {
    this.userForm = new FormGroup(
      {
        _id: new FormControl(this.user._id),
        firstName: new FormControl(this.user.firstName),
        lastName: new FormControl(this.user.lastName),
        congregation: new FormControl(this.user.congregation),
        baptized: new FormControl(this.user.baptized),
        publisher: new FormControl(this.user.publisher),
        genre: new FormControl(this.user.genre),
        child: new FormControl(this.user.child),
        phone: new FormControl(this.user.phone),
        email: new FormControl(this.user.email),
        overseer: new FormControl(this.user.overseer),
        disabled: new FormControl(this.user.disabled),
        // familyMembers: new FormControl(this.user.familyMembers),
        parts: new FormControl(this.user.parts),
        ownerId: new FormControl(this.user.ownerId),
        // assignments: new FormControl(this.user.assignments)
      },
      ValidationService.classValidator(new User())
    );

    console.log('User Parts: ', this.user.parts);

    this.toggleManFields();

    this.userEditProvider
      .getManFieldsDisable()
      .subscribe((val) => (this.manFieldsDisabled = val));

    this.userEditProvider
      .getOverseerFieldsDisable()
      .subscribe((val) => (this.overseerFieldsDisabled = val));
  }

  async showAlert() {
    const errorMessages = this.userForm.errors;

    this.translate.get('form-error').subscribe((message) => {
      this.messageService.presentToast(message);
    });
    // alert(errorMessages);
    // Show alert with error
    // const alert = await this.alertCtrl.create({
    //   header: 'form-error',
    //   // subHeader: errorMessages,
    //   buttons: ['OK']
    // });

    // return await alert.present();
  }

  async saveUser() {
    const saved = false;

    // trigger validation
    this.validationService.validateAllFormFields(this.userForm);

    try {
      if (this.userForm.valid) {
        // Make sure to create a deep copy of the form-model
        // let result = this.user;
        const result = User.fromJson(this.userForm.value) as User;
        // const result = Object.assign({}, this.userForm.value);
        // result.parts = Object.assign([], result.parts);

        // Do useful stuff with the gathered data
        const insertedUser = await this.userService.upsertUser(result);

        // TODO UserEdit check if save success
        // Go to users list, passing dummy data to force reload
        this.router.navigate(['users', { dummyData: new Date().getTime() }]);

        this.translate.get('user-save-success').subscribe((message) => {
          this.messageService.presentToast(message);
        });
      } else {
        this.showAlert();
      }
    } catch (error) {
      throw error;
    }

    if (saved) {
    }
  }

  async cancel() {
    // this.userForm.get('firstName').value;

    // Confirmation alert before closing the form

    this.router.navigate(['users']);
  }

  deleteUser() {
    // TODO show confirmation alert
    this.userService.deleteUser(this.user);

    // Go to users list, passing dummy data to force reload
    this.router.navigate(['users', { dummyData: new Date().getTime() }]);
    // this.redirectTo('users');

    this.translate.get('confirm-success').subscribe((message) => {
      this.messageService.presentToast(message);
    });
  }

  /**
   * Toggle disabled on fields concerning only men
   * @param val <boolean> true: Disabled; false: Enabled
   */
  toggleManFields(field?, event?) {
    if (this.userForm.value.genre === 'woman') {
      this.userEditProvider.setManFieldsDisable(true);
    } else {
      this.userEditProvider.setManFieldsDisable(false);
    }

    if (
      this.userForm.value.genre === 'woman' ||
      this.userForm.value.child || // (field === 'child' && event.value)
      !this.userForm.value.baptized
    ) {
      this.userEditProvider.setOverseerFieldsDisable(true);
    } else {
      this.userEditProvider.setOverseerFieldsDisable(false);
    }
  }

  getPartName(partId) {
    return this.partService.getPartName(partId);
  }

  /**
   * TODO: Allow the user to just click on a part to select/deselect it
   */
  togglePart(part: Part): void {
    let selectedParts: Part['_id'][] = this.userForm.controls.parts.value;
    let selectedPartIndex = -1;

    try {
      if (selectedParts !== null) {
        // search
        selectedPartIndex = selectedParts.findIndex(
          (selectedPartId, index, sParts) =>
            selectedPartId.toHexString() === part._id.toHexString()
        );
      } else {
        selectedParts = [];
      }

      if (selectedPartIndex !== -1) {
        // part already selected, remove it
        selectedParts.splice(selectedPartIndex, 1);
      } else {
        // Part not selected, add it
        selectedParts.push(part._id);
      }
      this.userForm.controls.parts.patchValue(selectedParts);

      this.userForm.get('parts').markAsTouched();

      this.userForm.get('parts').updateValueAndValidity({
        onlySelf: false,
        emitEvent: true,
      });
    } catch (error) {}
  }

  partSelected(part: Part): boolean {
    if (this.userForm.controls.parts.value !== null) {
      const partValue = this.userForm.controls.parts.value;

      return (
        // TODO Remove when parts comes from Mongo
        // partValue.find((selectedPart) => selectedPart.name === part.name) !==
        // undefined
        partValue.find((selectedPartId) => {
          return selectedPartId.toHexString() === part._id.toHexString();
        }) !== undefined
      );
    }

    return false;
  }

  log(error) {
    console.log(error);
  }

  /**
   * Redirect and force page reload
   * UNUSED
   */
  redirectTo(uri) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
