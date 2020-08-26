import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable()
export class AuthHelper {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  hideActionBar() {}

  configureMatIcon() {
    this.iconRegistry.addSvgIcon(
      'google-logo',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icon/google-logo.svg'
      )
    );
  }
}
