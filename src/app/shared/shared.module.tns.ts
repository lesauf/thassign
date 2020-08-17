import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { TranslateModule } from '@ngx-translate/core';

// import { ConfirmDialogComponent } from '@src/app/shared/components/confirm-dialog/confirm-dialog.component';
// import { ConfirmDirective } from '@src/app/shared/directives/confirm.directive';
// import { ControlMessagesComponent } from '@src/app/shared/components/control-messages/control-messages.component';
// import { MessagesComponent } from '@src/app/shared/components/messages/messages.component';
// import { TranslateDatePipe } from '@src/app/shared/pipes/translate-date.pipe';
// import { MonthPickerComponent } from '@src/app/shared/components/month-picker/month-picker.component';
// import { LoaderComponent } from '@src/app/shared/components/loader/loader.component';
// import { PickerComponent } from '@src/app/shared/components/picker/picker.component';
// import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';

@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    // ConfirmDirective,
    // ControlMessagesComponent,
    // LoaderComponent,
    // ImportEpubComponent,
    // MessagesComponent,
    // TranslateDatePipe,
    // MonthPickerComponent,
    // PickerComponent,
    // OptionsDialogComponent,
  ],
  imports: [NativeScriptCommonModule, TranslateModule],
  exports: [NativeScriptCommonModule, TranslateModule],
})
export class SharedModule {}
