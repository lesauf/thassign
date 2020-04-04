import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  TranslateModule,
  TranslateCompiler,
  TranslateLoader,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConstantsService } from './core/services/constants.service';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';
import { SidemenuItemComponent } from './shared/components/sidemenu-item/sidemenu-item.component';
import { TestComponent } from './shared/components/test/test.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ToolbarNotificationComponent } from './shared/components/toolbar-notification/toolbar-notification.component';
import { UserMenuComponent } from './shared/components/user-menu/user-menu.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    PageNotFoundComponent,
    SearchBarComponent,
    SidemenuComponent,
    SidemenuItemComponent,
    TestComponent,
    ToolbarComponent,
    ToolbarNotificationComponent,
    UserMenuComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    // Shared & Core
    CoreModule,
    SharedModule,
  ],

  providers: [ConstantsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
