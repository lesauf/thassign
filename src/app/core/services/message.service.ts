import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  constructor(private translate: TranslateService) {}

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  /**
   * First retrieve the translated message then display it
   * @todo Display a flashing toast with message
   * @param messageKey translated message key
   */
  async presentToast(messageKey: string) {
    this.translate.get(messageKey).subscribe((message) => {
      alert(message);
    });
  }
}
