import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { Routes } from '@angular/router';

import { AutoGeneratedComponent } from '@src/app/auto-generated/auto-generated.component';
import { AuthLayoutComponent } from '@src/app/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import { AppResolverService } from '@src/app/app-resolver.service';

export const routes: Routes = [
  {
    path: 'auth',
    // component: AuthLayoutComponent,
    loadChildren: () =>
      import('@src/app/modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    // component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      message: AppResolverService,
    },
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],

        loadChildren: () =>
          import('@src/app/modules/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
  {
    path: '',
    canActivateChild: [AuthGuard],

    loadChildren: () =>
      import('@src/app/modules/home/home.module').then((m) => m.HomeModule),
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
