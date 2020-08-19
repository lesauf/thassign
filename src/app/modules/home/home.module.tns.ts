import { NgModule } from '@angular/core';
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
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
