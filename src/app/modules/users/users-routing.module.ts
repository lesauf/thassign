import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from '@src/app/modules/users/pages/user-list/user-list.component';
import { UserDetailComponent } from '@src/app/modules/users/components/user-detail/user-detail.component';
import { UserEditComponent } from '@src/app/modules/users/pages/user-edit/user-edit.component';

const usersRoutes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  // {
  //   path: 'detail',
  //   component: UserDetailComponent,
  //   // data: { animation: 'user' }
  // },
  {
    path: 'add',
    component: UserEditComponent,
    // data: { animation: 'user' }
  },
  {
    path: 'edit',
    component: UserEditComponent,
    // data: { animation: 'user' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
