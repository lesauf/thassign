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
import { MessagesComponent } from '@src/app/shared/components/messages/messages.component';
import { TranslateDatePipe } from '@src/app/shared/pipes/translate-date.pipe';
import { MonthPickerComponent } from '@src/app/shared/components/month-picker/month-picker.component';
import { LoaderComponent } from '@src/app/shared/components/loader/loader.component';
import { PickerComponent } from '@src/app/shared/components/picker/picker.component';
import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ConfirmDirective,
    ControlMessagesComponent,
    LoaderComponent,
    // ImportEpubComponent,
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
    PickerComponent,
    OptionsDialogComponent,
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
    LoaderComponent,
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
    PickerComponent,
    OptionsDialogComponent,
  ],
})
export class SharedModule {}
