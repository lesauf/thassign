import { Injectable } from '@angular/core';
import { Page } from '@nativescript/core';

@Injectable()
export class LoginHelper {
  constructor(private page: Page) {}

  hideActionBar() {}
}
