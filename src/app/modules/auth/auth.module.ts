import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from './auth.guard';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
// import { TokenStorage } from './token.storage';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule],
  declarations: [LoginComponent, RegisterComponent],
  providers: [
    AuthGuard,
    AuthService,
    // TokenStorage
  ],
})
export class AuthModule {}
