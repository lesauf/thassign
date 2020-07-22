import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ComponentRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';

import { Assignment } from 'src/app/core/models/assignment/assignment.model';
import { Part } from 'src/app/core/models/part/part.model';
import { User } from 'src/app/core/models/user/user.model';
import { MatSelectChange } from '@angular/material/select';
import { AssignableListComponent } from '../assignable-list/assignable-list.component';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  @Input() assignment: Assignment;
  @Input() isEditMode: boolean;
  @Input() listOfParts: Part[];
  @Input() assignableListByPart: User[][];
  @Input() form: FormGroup;
  @Input() wIndex: number;

  @Output() isRemoved: EventEmitter<Assignment> = new EventEmitter();

  public displayComponentRef: ComponentRef<AssignableListComponent<User>>;

  @ViewChild('options', { static: false }) options: MatSelectionList;

  @ViewChild('assignableList')
  public assignableListTpl: TemplateRef<any>;

  /**
   * Assignable list for selected part
   */
  public assignableList: User[];

  public dialogRef = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    // this.data = this.injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    const componentFactory = this.resolver.resolveComponentFactory(
      AssignableListComponent
    );
    this.displayComponentRef = componentFactory.create(this.injector);
    // this.appRef.attachView(componentRef.hostView);
  }

  ngOnDestroy() {
    this.displayComponentRef.destroy();
  }

  get isValid() {
    return this.form.controls[this.assignment.key].valid;
  }

  /**
   * Clear the assignment everytime its part changes
   */
  onPartChange(partSelected: MatSelectChange) {
    this.form
      .get([this.wIndex, this.assignment.position])
      .setValue(this.assignment);
    this.form
      .get([this.wIndex, this.assignment.position])
      .patchValue({ part: partSelected.value });

    // this.assignableList = this.assignableListByPart[partSelected.value.name];

    // console.log(this.assignableList);
  }

  removeAssignment() {
    this.isRemoved.emit(this.assignment);
  }

  closeDialog() {
    this.form
      .get([this.wIndex, this.assignment.position])
      .setValue(this.assignment);
    this.form
      .get([this.wIndex, this.assignment.position])
      .patchValue({ assignee: this.options.selectedOptions.selected[0].value });

    console.log(this.options.selectedOptions.selected[0].value);
    // this.dialogRef.close();
  }

  /**
   * Used to set the value of Select list
   */
  compareFn(c1, c2): boolean {
    // console.log(c1);
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }
}
