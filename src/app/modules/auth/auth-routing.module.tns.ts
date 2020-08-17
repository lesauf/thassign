import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { LoginComponent } from '@src/app/modules/auth/login/login.component';
import { LogoutComponent } from '@src/app/modules/auth/logout/logout.component';
import { RegisterComponent } from '@src/app/modules/auth/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
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
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class AuthRoutingModule {}

export const navigatableAuthComponents = [
  LoginComponent,
  LogoutComponent,
  RegisterComponent,
];
