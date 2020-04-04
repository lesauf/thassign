import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

// const debug = require('debug')('todo');
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: [
    './toolbar-notification.component.scss',
    // './toolbar-notification.component.scss-theme.scss'
  ],
})
/**
 * Updated from cdk to display the notifications in a mat-dialog
 */
export class ToolbarNotificationComponent implements OnInit {
  // private readonly _matDialogRef: MatDialogRef<ToolbarNotificationComponent>;
  private triggerElementRef: ElementRef;

  public notifications = [];

  /**
   *
   * @param _matDialogRef The dialog reference
   * @param data The trigger btn reference
   */
  constructor(
    private _matDialogRef: MatDialogRef<ToolbarNotificationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { trigger: ElementRef; notifications: [] },
    public messageService: MessageService
  ) {}

  /**
   * Create the dialog and position it right under the notification button
   */
  ngOnInit() {
    // this._matDialogRef = _matDialogRef;
    this.triggerElementRef = this.data.trigger;
    this.notifications = this.data.notifications;

    // Adjust the positioning and size of the dialog
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = {
      left: `${rect.left - 150}px`,
      top: `${rect.bottom}px`,
    };
    matDialogConfig.width = '500px';
    // matDialogConfig.height = '400px';
    this._matDialogRef.updateSize(
      matDialogConfig.width
      // matDialogConfig.height
    );
    this._matDialogRef.updatePosition(matDialogConfig.position);
  }

  cancel(): void {
    this._matDialogRef.close(null);
  }

  selectNotification(notification) {
    console.log('TODO ToolbalNotifi... : Select notification');
  }

  deleteNotification(notification) {
    console.log('TODO ToolbalNotifi... : Delete notification');
  }
}

/*import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: [
    './toolbar-notification.component.scss'
    // './toolbar-notification.component.scss-theme.scss'
  ]
})
export class ToolbarNotificationComponent implements OnInit {
  cssPrefix = 'toolbar-notification';
  isOpen: boolean = false;
  @Input() notifications = [];

  // @HostListener('document:click', ['$event', '$event.target'])
  // onClick(event: MouseEvent, targetElement: HTMLElement) {
  //     if (!targetElement) {
  //           return;
  //     }
  //     const clickedInside = this.elementRef.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //          this.isOpen = false;
  //     }
  // }

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  select() {}

  delete(notification) {}
}
*/
