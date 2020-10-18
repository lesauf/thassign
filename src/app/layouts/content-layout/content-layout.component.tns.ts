import { Component, OnInit, NgZone } from '@angular/core';
import { Page } from '@nativescript/core';
import { RouterExtensions } from '@nativescript/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-layout',
  moduleId: module.id,
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit {
  selectedTab: number = 0;

  constructor(
    private page: Page,
    private routerExtension: RouterExtensions,
    private activeRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // this.page.actionBarHidden = true;

    // this.ngZone.run(() => {
    this.routerExtension
      .navigate(
        [
          {
            outlets: {
              homeTab: ['home'],
              // usersTab: ['users'],
              // assignmentsTab: ['assignments'],
            },
          },
        ],
        { relativeTo: this.activeRoute }
      )
      .then()
      .catch((error) => {
        console.log(error);
      });
    // });
  }

  // onSelectedIndexChanged(index) {
  //   this.selectedTab = index;
  // }
  // onItemTapped(newIndexObj) {
  //   const isInSameTab = newIndexObj.index === this.selectedTab ? true : false;
  //   if (isInSameTab) {
  //     if (this.selectedTab === 0) {
  //       this.router.navigate([{ outlets: { homeTab: ['home'] } }], {
  //         relativeTo: this.route,
  //       });

  //       /*
  //   this.routerExtensions.navigate(['/tabsWrapper/{homeTab:home}/home'], {
  //     clearHistory: true
  //   });

  //   this.routerExtensions.navigate(['/tabsWrapper/'], {
  //     clearHistory: true
  //   });
  //   this.router.navigate(["../"], {  });
  //   */
  //     }
  //   }
  // }
}
