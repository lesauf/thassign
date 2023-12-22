import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { MessageService } from '@src/app/core/services/message.service';
import { ToolbarHelpers } from '@src/app/shared/components/toolbar/toolbar.helpers';
import { ToolbarNotificationComponent } from '@src/app/shared/components/toolbar-notification/toolbar-notification.component';
import { User } from '@src/app/core/models/user/user.model';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@src/app/core/services/backend.service';

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

  searchOpen = false;
  toolbarHelpers = ToolbarHelpers;

  currentUser: any;

  constructor(
    private _matDialog: MatDialog,
    private backendService: BackendService,

    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.backendService.getSignedInUser();
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
