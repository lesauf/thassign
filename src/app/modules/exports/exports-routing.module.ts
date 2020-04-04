import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExportsComponent } from './exports.component';

const exportsRoutes: Routes = [
  {
    path: '',
    component: ExportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(exportsRoutes)],
  exports: [RouterModule]
})
export class ExportsRoutingModule {}
