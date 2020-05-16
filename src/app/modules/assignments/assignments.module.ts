import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { AssignmentListComponent } from './pages/assignment-list/assignment-list.component';
import { AssigmentsRoutingModule } from './assignments-routing.module';
// import { AssignmentWeekendComponent } from './components/assignment-weekend/assignment-weekend.component';
import { AssignmentMidweekStudentsComponent } from './components/assignment-midweek-students/assignment-midweek-students.component';
import { AssignmentMidweekComponent } from './components/assignment-midweek/assignment-midweek.component';

@NgModule({
  imports: [AssigmentsRoutingModule, SharedModule, TranslateModule],
  // entryComponents: [AssignmentWeekendComponent, AssignmentMidweekStudentsComponent],
  declarations: [
    AssignmentListComponent,
    // AssignmentWeekendComponent,
    AssignmentMidweekStudentsComponent,
    AssignmentMidweekComponent]
})
export class AssignmentsModule { }
