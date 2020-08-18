import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NativeScriptCommonModule,
  NativeScriptModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';

import { SharedModule } from '@src/app/shared/shared.module';

import { AuthGuard } from '@src/app/modules/auth/auth.guard';

import {
  AuthRoutingModule,
  navigatableAuthComponents,
} from '@src/app/modules/auth/auth-routing.module';
import { AuthService } from '@src/app/modules/auth/auth.service';
// import { TokenStorage } from './token.storage';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [...navigatableAuthComponents],
  providers: [
    // AuthGuard,
    AuthService,
    // TokenStorage
  ],
})
export class AuthModule {}
