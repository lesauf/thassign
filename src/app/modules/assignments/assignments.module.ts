import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { AssignmentListComponent } from './pages/assignment-list/assignment-list.component';
import { AssigmentsRoutingModule } from './assignments-routing.module';
// import { AssignmentWeekendComponent } from './components/assignment-weekend/assignment-weekend.component';
import { AssignmentMidweekStudentsComponent } from './components/assignment-midweek-students/assignment-midweek-students.component';
// import { AssignmentMidweekComponent } from './components/assignment-midweek/assignment-midweek.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { AssignableListComponent } from './components/assignable-list/assignable-list.component';

@NgModule({
  imports: [
    AssigmentsRoutingModule,
    DragDropModule,
    SharedModule,
    TranslateModule,
  ],
  entryComponents: [AssignableListComponent],
  declarations: [
    AssignableListComponent,
    AssignmentListComponent,
    // AssignmentWeekendComponent,
    AssignmentMidweekStudentsComponent,
    // AssignmentMidweekComponent,
    AssignmentComponent,
  ],
})
export class AssignmentsModule {}
