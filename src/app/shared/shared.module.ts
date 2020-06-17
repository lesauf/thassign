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
import { LoaderComponent } from './components/loader/loader.component';
import { PickerComponent } from './components/picker/picker.component';
import { OptionsDialogComponent } from './components/options-dialog/options-dialog.component';

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
  entryComponents: [OptionsDialogComponent],
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
