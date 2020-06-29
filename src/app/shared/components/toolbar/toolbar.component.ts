import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MessageService } from 'src/app/core/services/message.service';
import { ToolbarHelpers } from './toolbar.helpers';
import { ToolbarNotificationComponent } from '../toolbar-notification/toolbar-notification.component';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ma-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() sidenav;
  @Input() sidebar;
  @Input() drawer;
  @Input() matDrawerShow;

  searchOpen: boolean = false;
  toolbarHelpers = ToolbarHelpers;

  currentUser: { customData: User };

  constructor(
    private _matDialog: MatDialog,
    private authService: AuthService,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
  }

  // Call the dialog
  showNotificationsDialog(evt: Event): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this._matDialog.open(ToolbarNotificationComponent, {
      data: {
        trigger: target,
        notifications: this.toolbarHelpers.notifications,
      },
    });
    dialogRef.afterClosed().subscribe((_res) => {});
  }
}
