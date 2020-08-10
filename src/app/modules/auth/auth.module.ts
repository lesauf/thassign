import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@src/app/shared/shared.module';

import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import { AuthRoutingModule } from '@src/app/modules/auth/auth-routing.module';
import { LoginComponent } from '@src/app/modules/auth/login/login.component';
import { LogoutComponent } from '@src/app/modules/auth/logout/logout.component';
import { RegisterComponent } from '@src/app/modules/auth/register/register.component';
import { AuthService } from '@src/app/modules/auth/auth.service';
// import { TokenStorage } from './token.storage';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule],
  declarations: [LoginComponent, LogoutComponent, RegisterComponent],
  providers: [
    AuthGuard,
    AuthService,
    // TokenStorage
  ],
})
export class AuthModule {}
