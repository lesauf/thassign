import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { UserService } from 'src/app/modules/users/user.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit, OnChanges {
  @Input() isVisible = true;
  visibility = 'shown';

  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatDrawer) drawer: MatDrawer;

  sideNavOpened = true;
  matDrawerOpened = false;
  matDrawerShow = true;
  sideNavMode = 'side';

  constructor(
    public mediaObserver: MediaObserver,
    private userService: UserService
  ) {}

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  ngOnInit() {
    this.mediaObserver.media$.subscribe((mediaChange: MediaChange) => {
      this.toggleView();
    });
  }

  ngOnDestroy() {
    this.userService.destroy();
  }

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
    // return outlet.isActivated ? outlet.activatedRoute : ''
  }

  /**
   * Called on a submenu selected to close the sidebar
   */
  closeSidebar() {
    if (!this.sideNavOpened) {
      // If not opened by default (on small screens)
      this.sidenav.close();

      if (this.matDrawerShow) {
        // if drawer is shown by default
        this.drawer.toggle();
      }
    }
  }

  toggleView() {
    if (this.mediaObserver.isActive('gt-md')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.mediaObserver.isActive('gt-xs')) {
      this.sideNavMode = 'side';
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.mediaObserver.isActive('lt-sm')) {
      this.sideNavMode = 'over';
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }
}
