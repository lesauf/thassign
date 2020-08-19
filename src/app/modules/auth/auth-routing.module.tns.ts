import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { AuthComponent } from '@src/app/modules/auth/auth.component';
import { LogoutComponent } from '@src/app/modules/auth/logout/logout.component';
import { RegisterComponent } from '@src/app/modules/auth/register/register.component';

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
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class AuthRoutingModule {}

export const navigatableAuthComponents = [
  AuthComponent,
  LogoutComponent,
  RegisterComponent,
];
