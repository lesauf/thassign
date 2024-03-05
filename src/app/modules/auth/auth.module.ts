import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@src/app/shared/shared.module';

import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import {
  AuthRoutingModule,
  navigatableAuthComponents,
} from '@src/app/modules/auth/auth-routing.module';
import { AuthService } from '@src/app/modules/auth/auth.service';
// import { TokenStorage } from './token.storage';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule, TranslateModule],
  declarations: [...navigatableAuthComponents],
  providers: [
    AuthGuard,
    AuthService,
    // TokenStorage
  ],
})
export class AuthModule {}
