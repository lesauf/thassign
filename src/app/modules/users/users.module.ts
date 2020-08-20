import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@src/app/shared/shared.module';
import { UserListComponent } from '@src/app/modules/users/pages/user-list/user-list.component';
import { UserEditComponent } from '@src/app/modules/users/pages/user-edit/user-edit.component';
import { UserDetailComponent } from '@src/app/modules/users/components/user-detail/user-detail.component';
import { UserFilterComponent } from '@src/app/modules/users/components/user-filter/user-filter.component';
import { UserSortComponent } from '@src/app/modules/users/components/user-sort/user-sort.component';
import { UsersRoutingModule } from '@src/app/modules/users/users-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserDetailComponent,
    UserFilterComponent,
    UserSortComponent,
  ],
  imports: [SharedModule, UsersRoutingModule, TranslateModule],
})
export class UsersModule {}
