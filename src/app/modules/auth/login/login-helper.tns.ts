import { Injectable } from '@angular/core';
import { Page } from '@nativescript/core';
// import Theme from '@nativescript/theme';

@Injectable()
export class LoginHelper {
  constructor(private page: Page) // private theme: Theme
  {
    // Theme.setMode(Theme.Dark);
  }

  public hideActionBar() {
    this.page.actionBarHidden = true;
  }
}
