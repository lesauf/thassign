import { NgModule, LOCALE_ID } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

import { AuthHeaderInterceptor } from './interceptors/auth-header.interceptor';
// import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { LuxonDateAdapter } from './adapters/luxon-date-adapter/luxon-date-adapter';
import { MatPaginationIntlService } from './services/mat-paginator-intl.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true
    // },
    {
      // Define DateAdapter for Mat_DatePicker
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      // Define translation for Mat_Paginator
      provide: MatPaginatorIntl,
      useFactory: translate => {
        const service = new MatPaginationIntlService();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    },
    {
      // Define locale from Translate Service at runtime
      provide: LOCALE_ID,
      useFactory: translate => {
        return translate.currentLang;
      },
      deps: [TranslateService]
    }
  ]
})
export class CoreModule {
  constructor(
    private dateAdapter: LuxonDateAdapter,
    private translate: TranslateService
  ) {
    // Localization of the datepicker
    // TODO: Make the datepicker change text automatically
    this.translate.onLangChange.subscribe(() => {
      this.dateAdapter.setLocale(this.translate.currentLang);
    });
  }
}
