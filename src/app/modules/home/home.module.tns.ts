import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from '@src/app/modules/home/home.component';
import { SharedModule } from '@src/app/shared/shared.module';
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
  NativeScriptHttpClientModule,
} from '@nativescript/angular';

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
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ]),
  ],
  declarations: [HomeComponent],
  schemas: [NO_ERRORS_SCHEMA], // Useful to use NS custom elements
})
export class HomeModule {}
