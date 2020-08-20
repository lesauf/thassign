import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';

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

  cities: Observable<any[]>;

  constructor(
    // private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router,
    private translate: TranslateService
  ) {
    // var citiesRef = firestore.collection('cities', (ref) =>
    //   ref.where('capital', '==', true)
    // );
    // this.cities = citiesRef.valueChanges();
    // citiesRef.doc('SF').set({
    //   name: 'San Francisco',
    //   state: 'CA',
    //   country: 'USA',
    //   capital: false,
    //   population: 860000,
    //   regions: ['west_coast', 'norcal'],
    // });
    // citiesRef.doc('LA').set({
    //   name: 'Los Angeles',
    //   state: 'CA',
    //   country: 'USA',
    //   capital: false,
    //   population: 3900000,
    //   regions: ['west_coast', 'socal'],
    // });
    // citiesRef.doc('DC').set({
    //   name: 'Washington, D.C.',
    //   state: null,
    //   country: 'USA',
    //   capital: true,
    //   population: 680000,
    //   regions: ['east_coast'],
    // });
    // citiesRef.doc('TOK').set({
    //   name: 'Tokyo',
    //   state: null,
    //   country: 'Japan',
    //   capital: true,
    //   population: 9000000,
    //   regions: ['kanto', 'honshu'],
    // });
    // citiesRef.doc('BJ').set({
    //   name: 'Beijing',
    //   state: null,
    //   country: 'China',
    //   capital: true,
    //   population: 21500000,
    //   regions: ['jingjinji', 'hebei'],
    // });
  }

  ngOnInit(): void {
    // init this.user on startup
    // this.authService.me().subscribe(data => {
    //   this.user = data.user;
    // });

    // update this.user after login/register/logout
    // this.userSubscription = this.authService.$userSource.subscribe(user => {
    //   this.user = user;
    // });

    // this.page.actionBarHidden = true;

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
