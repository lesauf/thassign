import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';

// import { UserType } from '../../../../../../server/src/modules/users/user.schema';
// import { User } from '../../../models/users.schema';
import { UserService } from '@src/app/modules/users/user.service';
import { User } from '@src/app/core/models/user/user.model';
import { UserDetailComponent } from '@src/app/modules/users/components/user-detail/user-detail.component';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
})
export class UserFilterComponent implements OnInit {
  @Output()
  performedSearch: EventEmitter<string> = new EventEmitter<string>();

  users$: Observable<any[]>;
  searchText: string;

  /**
   * List of filters on the form filterName => dbField | type of dbField
   */
  filtersList = {
    elder: 'overseer',
    'ministerial-servant': 'overseer',
    man: 'genre',
    woman: 'genre',
    child: 'boolean',
    baptized: 'boolean',
    disabled: 'boolean',
    'not-disabled': 'boolean-false',
    publisher: 'boolean',
  };

  /**
   * Extract the names of filters as array for the view
   */
  filtersName = Object.keys(this.filtersList);

  selectedFilters = [];

  /**
   * Set the expanded status of the search panel
   */
  displayMore = false;
  inputControl = new UntypedFormControl();
  private searchTerms = new Subject<string>();

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.users$ = this.inputControl.valueChanges.pipe(
    //   map(value => (typeof value === 'string' ? value : value.firstName)),
    //   map(name => (name ? this._filter(name) : this.options.slice()))
    // );
    // this.users$ =
    this.searchTerms
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),

        // ignore new term if same as previous term
        distinctUntilChanged(),

        tap((term) => {
          this.searchText = term;
          this.searchUsers();
        })

        // switch to new search observable each time the term changes
        // switchMap((term: string) => this.userService.searchUsers(term))
      )
      .subscribe();
  }

  // Push a search term into the observable stream.
  search(): void {
    this.searchTerms.next(this.searchText);
  }

  displayFn(user?: any): string | undefined {
    return user ? `${user.firstName}` : undefined; // ${user.lastName}
  }

  /**
   * Apply the filters by passing them to the service
   * and emit the search text
   */
  searchUsers() {
    const sFiltersObj = {};

    this.selectedFilters.forEach((fName) => {
      sFiltersObj[fName] = this.filtersList[fName];
    });

    this.userService.filters = sFiltersObj;

    this.performedSearch.emit(this.searchText);
  }

  /**
   * open a dialog with details of a user
   */
  openView(user: User) {
    this.dialog.open(UserDetailComponent, {
      data: {
        user: user,
      },
    });
  }

  /**
   * Clear filters and search text then call the search function
   */
  clearFilters() {
    this.selectedFilters = [];
    this.userService.filters = {};
    this.searchText = '';

    this.searchUsers();
  }

  /**
   * Select/deselect a filter chip
   */
  toggleFilter(filter: string) {
    const index = this.selectedFilters.indexOf(filter);
    if (index === -1) {
      // Not selected
      this.selectedFilters.push(filter);
    } else {
      this.selectedFilters.splice(index, 1);
    }
  }

  /**
   * Check if a filter is in the list of selected filters
   */
  filterSelected(filter: string) {
    return this.selectedFilters.indexOf(filter) !== -1;
  }
}
