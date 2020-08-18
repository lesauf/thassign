import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { Routes } from '@angular/router';

import { AutoGeneratedComponent } from '@src/app/auto-generated/auto-generated.component';
import { AuthLayoutComponent } from '@src/app/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    // component: AuthLayoutComponent,
    loadChildren: () =>
      import('@src/app/modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auto-generated',
    component: AutoGeneratedComponent,
  },
];

@NgModule({
  imports: [NativeScriptRouterModule, NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
