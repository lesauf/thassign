import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '@src/app/modules/auth/auth.component';
// import { LoginComponent } from '@src/app/modules/auth/login/login.component';
import { LogoutComponent } from '@src/app/modules/auth/logout/logout.component';
// import { RegisterComponent } from '@src/app/modules/auth/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'login',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  // {
  //   path: '',
  //   redirectTo: '/auth/login',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  // {
  //   path: 'logout',
  //   component: LogoutComponent,
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

export const navigatableAuthComponents = [AuthComponent, LogoutComponent];
