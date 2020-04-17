import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDirective } from './directives/confirm.directive';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { MessagesComponent } from './components/messages/messages.component';
import { TranslateDatePipe } from './pipes/translate-date.pipe';
import { MonthPickerComponent } from './components/month-picker/month-picker.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ConfirmDirective,
    ControlMessagesComponent,
    // ImportEpubComponent,
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
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
    MessagesComponent,
    TranslateDatePipe,
    MonthPickerComponent,
  ],
})
export class SharedModule {}
