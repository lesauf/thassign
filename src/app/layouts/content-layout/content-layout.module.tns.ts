import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';
import { FormsModule } from '@angular/forms';

import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import { ContentLayoutComponent } from '@src/app/layouts/content-layout/content-layout.component';

import { HomeComponent } from '@src/app/modules/home/home.component';
import { SharedModule } from '@src/app/shared/shared.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    FormsModule,
    SharedModule,
    NativeScriptRouterModule.forChild([
      {
        path: 'home',
        // canActivate: [AuthGuard],

        // outlet: 'homeTab',
        // component: NSEmptyOutletComponent,
        component: HomeComponent,
        // loadChildren: () =>
        //   import('@src/app/modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: '',
        // component: ContentLayoutComponent,
        // canActivate: [AuthGuard],
        // resolve: {
        //   message: AppResolverService,
        // },
        redirectTo: '/content/home',
        // redirectTo:
        //   '/content/(homeTab:home1//usersTab:home1//assignmentsTab:home1)',
        pathMatch: 'full',
        // children: [],
      },
    ]),
  ],

  declarations: [HomeComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ContentLayoutModule {}
