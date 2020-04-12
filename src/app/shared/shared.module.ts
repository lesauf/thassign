import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { ControlMessagesComponent } from './components/control-messages/control-messages.component';

@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    // ConfirmDirective,
    ControlMessagesComponent,
    // ImportEpubComponent,
    // MessagesComponent,
    // TranslateDatePipe,
    // MonthPickerComponent,
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
  ],
})
export class SharedModule {}
