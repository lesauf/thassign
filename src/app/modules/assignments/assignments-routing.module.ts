import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentListComponent } from '@src/app/modules/assignments/pages/assignment-list/assignment-list.component';

const assigmentsRoutes: Routes = [
  {
    path: '',
    component: AssignmentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(assigmentsRoutes)],
  exports: [RouterModule]
})
export class AssigmentsRoutingModule {}
