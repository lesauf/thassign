import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@src/app/shared/shared.module';
import { AssignmentListComponent } from '@src/app/modules/assignments/pages/assignment-list/assignment-list.component';
import { AssigmentsRoutingModule } from '@src/app/modules/assignments/assignments-routing.module';
// import { AssignmentWeekendComponent } from './components/assignment-weekend/assignment-weekend.component';
import { AssignmentMidweekStudentsComponent } from '@src/app/modules/assignments/components/assignment-midweek-students/assignment-midweek-students.component';
import { AssignmentMidweekComponent } from './components/assignment-midweek/assignment-midweek.component';
import { AssignmentComponent } from '@src/app/modules/assignments/components/assignment/assignment.component';
import { AssignableListComponent } from '@src/app/modules/assignments/components/assignable-list/assignable-list.component';

@NgModule({
  imports: [
    AssigmentsRoutingModule,
    DragDropModule,
    SharedModule,
    TranslateModule,
    MatTooltipModule
  ],
  declarations: [
    AssignableListComponent,
    AssignmentListComponent,
    // AssignmentWeekendComponent,
    AssignmentMidweekStudentsComponent,
    AssignmentMidweekComponent,
    AssignmentComponent,
  ],
  schemas: [
  CUSTOM_ELEMENTS_SCHEMA
],
})
export class AssignmentsModule {}
