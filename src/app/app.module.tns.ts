import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NativeScriptModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule,
} from '@nativescript/angular';
import {
  TranslateModule,
  TranslateLoader,
  TranslateCompiler,
} from '@ngx-translate/core';

import { AppRoutingModule } from '@src/app/app-routing.module.tns';
import { AppComponent } from '@src/app/app.component';
import { AuthLayoutComponent } from '@src/app/layouts/auth-layout/auth-layout.component';
import { AutoGeneratedComponent } from '@src/app/auto-generated/auto-generated.component';
import { AuthGuard } from '@src/app/modules/auth/auth.guard';
import { AuthModule } from '@src/app/modules/auth/auth.module';
import { AuthService } from '@src/app/modules/auth/auth.service';
import { BackendService } from '@src/app/core/services/backend.service';
import { FirebaseService } from '@src/app/core/services/firebase.service';
import { CoreModule } from '@src/app/core/core.module';
import { SharedModule } from '@src/app/shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule} from '@nativescript/angular';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http, '@src/assets/i18n/', '.json');
  return new TranslateHttpLoader(http);
}

import * as firebase from 'nativescript-plugin-firebase';

firebase
  .init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
  })
  .then(
    () => {
      console.log('firebase.init done');
    },
    (error) => {
      console.log(`firebase.init error: ${error}`);
    }
  );

@NgModule({
  declarations: [AppComponent, AuthLayoutComponent, AutoGeneratedComponent],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
      defaultLanguage: 'en',
    }),
    // AuthModule,

    // Shared & Core
    CoreModule,
    SharedModule,
  ],
  providers: [AuthGuard, AuthService, BackendService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
