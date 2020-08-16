import { NgModule, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LuxonDateAdapter } from '@src/app/core/adapters/luxon-date-adapter/luxon-date-adapter';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      // Define locale from Translate Service at runtime
      provide: LOCALE_ID,
      useFactory: (translate) => {
        return translate.currentLang;
      },
      deps: [TranslateService],
    },
  ],
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
