import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { UserSortComponent } from './components/user-sort/user-sort.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserDetailComponent,
    UserFilterComponent,
    UserSortComponent
  ],
  imports: [SharedModule, UsersRoutingModule, TranslateModule],
  entryComponents: [UserEditComponent, UserFilterComponent, UserSortComponent]
})
export class UsersModule {}
