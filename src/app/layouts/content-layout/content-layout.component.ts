import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { UserService } from '@src/app/modules/users/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit, OnChanges {
  @Input() isVisible = true;
  visibility = 'shown';
  breakpoint$: Observable<boolean>;

  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatDrawer) drawer: MatDrawer;

  sideNavOpened = true;
  matDrawerOpened = false;
  matDrawerShow = true;
  sideNavMode = 'side';
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService
  ) {}

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.sideNavMode = 'over';
        this.sideNavOpened = false;
        this.matDrawerOpened = false;
        this.matDrawerShow = false;
        // S'exécute lorsque l'écran est de type XS
      }
  
      if (result.breakpoints[Breakpoints.Small]) {
        this.sideNavMode = 'side';
        this.sideNavOpened = false;
        this.matDrawerOpened = true;
        this.matDrawerShow = true;
        // S'exécute lorsque l'écran est de type SM
      }
  
      if (result.breakpoints[Breakpoints.Medium]) {
        this.sideNavMode = 'side';
        this.sideNavOpened = true;
        this.matDrawerOpened = false;
        this.matDrawerShow = true;;
        // S'exécute lorsque l'écran est de type MD
      }
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

}