import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];

  constructor() { }

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  async presentToast(message: string) {
    // Display a flashing toast with message
    // alert(message);
  }
}
