import {
  Component,
  OnDestroy,
  OnInit,
  Type,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { DateTime } from 'luxon';

import { AssignmentWeekendComponent } from '../../components/assignment-weekend/assignment-weekend.component';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/modules/users/user.service';
import { PartService } from 'src/app/core/services/part.service';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
})
export class AssignmentListComponent implements OnInit, OnDestroy {
  @ViewChild(
    'container',
    /* TODO: add static flag */ /* TODO: add static flag */ {
      read: ViewContainerRef,
    }
  )
  container: ViewContainerRef;

  // Keep track of list of generated components for removal purposes
  components = [];

  /**
   * current week for which the program is displayed
   */
  selectedWeek: DateTime;

  /**
   * current month for which the program is displayed
   */
  selectedMonth: DateTime;

  /**
   * Hold the previous selected week in case of rollback
   */
  previousSelectedWeek: DateTime;

  /**
   * Day of week starting (0 = sunday, 6 = saturday)
   */
  startDayOfWeek: number;

  // Expose class so that it can be used in the template
  weekendMeetingComponentClass = AssignmentWeekendComponent;

  /**
   * Edit mode, useful for disabling the month selector
   */
  isEditMode = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private settingService: SettingService
  ) {}

  ngOnInit() {
    this.startDayOfWeek = this.settingService.getStartDayOfWeek();

    // this.displayWeek(this.weekendMeetingComponentClass);
  }

  ngOnDestroy() {
    if (this.container !== undefined) {
      this.container.clear();
    }
    // .componentRef.destroy();
  }

  getSelectedWeek(event) {
    this.selectedWeek = event;
  }

  getSelectedMonth(event) {
    this.selectedMonth = event;
  }

  /**
   * Enable/disable the navigation if the form in tab is not saved
   * @param $disable boolean Disable or not
   */
  disableNavigation($disable) {
    this.isEditMode = $disable;
    // if ($disable === true) {
    //   this.selectedWeek.disable();
    // } else {
    //   this.selectedWeek.enable();
    // }
  }

  /**
   *
   * Just in the case I decide to dynamically add programs
   */
  displayWeek(componentClass: Type<any>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      componentClass
    );

    if (this.container) {
      const component = this.container.createComponent(componentFactory);
      // Passing inputs
      // First calculate the week
      const componentDate = this.selectedWeek;
      component.instance.week = componentDate;

      // Push the component so that we can keep track of which components are    created
      this.components.push(component);
    }
  }

  /**
   * Unused
   * Just in the case I decide to dynamically add programs
   */
  removeComponent(componentClass: Type<any>) {
    // Find the component
    const component = this.components.find(
      (c) => c.instance instanceof componentClass
    );
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
    }
  }
}
