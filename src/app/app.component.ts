import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

// import { AuthService } from './modules/auth/auth.service';

// import { SharedModule } from './shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * @description Property that stores the selected language value
   * from the component
   */
  public language: string;

  private userSubscription: Subscription;
  public user: any;

  constructor(
    // private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // init this.user on startup
    // this.authService.me().subscribe(data => {
    //   this.user = data.user;
    // });

    // update this.user after login/register/logout
    // this.userSubscription = this.authService.$userSource.subscribe(user => {
    //   this.user = user;
    // });

    this._initTranslationLanguage();
  }

  logout(): void {
    // this.authService.signOut();
    this.navigate('');
  }

  navigate(link: any): void {
    this.router.navigate([link]);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Set the default language for translation strings
   * and the current language.
   */
  private _initTranslationLanguage() {
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('fr'); // Set the current language
    }

    // Setting locale for dates
  }
}
