import { NgModule } from '@angular/core';

import { ExportsComponent } from './exports.component';
import { ExportsRoutingModule } from './exports-routing.module';
import { SharedModule } from '@src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ExportsComponent],
  imports: [SharedModule, ExportsRoutingModule, TranslateModule],
})
export class ExportsModule {}
