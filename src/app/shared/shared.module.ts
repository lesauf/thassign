import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@src/app/shared/material.module';
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { ConfirmDialogComponent } from '@src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDirective } from '@src/app/shared/directives/confirm.directive';
import { ControlMessagesComponent } from '@src/app/shared/components/control-messages/control-messages.component';
import { ImportEpubComponent } from '@src/app/shared/components/import-epub/import-epub.component';
import { MessagesComponent } from '@src/app/shared/components/messages/messages.component';
import { MonthPickerComponent } from '@src/app/shared/components/month-picker/month-picker.component';
import { LoaderComponent } from '@src/app/shared/components/loader/loader.component';
import { PickerComponent } from '@src/app/shared/components/picker/picker.component';
import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';
import { TranslateDatePipe } from '@src/app/shared/pipes/translate-date.pipe';
import { WithLoadingPipe } from '@src/app/shared/pipes/with-loading.pipe';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ConfirmDirective,
    ControlMessagesComponent,
    ImportEpubComponent,
    LoaderComponent,
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
    PickerComponent,
    OptionsDialogComponent,
    WithLoadingPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    CoreModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    CoreModule,
    ConfirmDialogComponent,
    ConfirmDirective,
    ControlMessagesComponent,
    ControlMessagesComponent,
    ImportEpubComponent,
    LoaderComponent,
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
    OptionsDialogComponent,
    PickerComponent,
    WithLoadingPipe,
  ],
})
export class SharedModule {}
