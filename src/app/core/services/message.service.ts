import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  /**
   * Add a notification in the toolbar
   * @param message
   */
  add(message: string) {
    this.messages.push(message);
  }

  /**
   * Log message for debugging purpose
   * Eventually notify my mail
   * @param message
   * @param infos Error/ Call stack, ... any infos useful
   */
  log(message: string, infos?: any) {
    this.add(message);
  }

  /**
   * Clear the notifications
   */
  clear() {
    this.messages = [];
  }

  /**
   * Display a short message to the user
   * @todo Display a flashing toast with message
   * @param messageKey translated message key
   */
  async presentToast(messageKey: string) {

    console.log();
    this.translate.get(messageKey).subscribe((message) => {
      this._snackBar.open(message, '', {
        duration: 5000,
      });
    });
  }
}
