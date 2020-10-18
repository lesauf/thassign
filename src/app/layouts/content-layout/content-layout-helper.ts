import { Injectable, ViewChild } from '@angular/core';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';

@Injectable()
export class ContentLayoutHelper {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatDrawer) drawer: MatDrawer;

  constructor() {}

  /**
   * Called on a submenu selected to close the sidebar
   */
  closeSidebar(sideNavOpened: boolean, matDrawerShow: boolean) {
    if (!sideNavOpened) {
      // If not opened by default (on small screens)
      this.sidenav.close();

      if (matDrawerShow) {
        // if drawer is shown by default
        this.drawer.toggle();
      }
    }
  }
}
