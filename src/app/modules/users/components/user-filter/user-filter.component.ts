import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap
} from 'rxjs/operators';

// import { UserType } from '../../../../../../server/src/modules/users/user.schema';
// import { User } from '../../../models/users.schema';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent implements OnInit {
  @Output()
  performedSearch: EventEmitter<string> = new EventEmitter<string>();

  users$: Observable<any[]>;
  searchText: string;

  /**
   * Set the expanded status of the search panel
   */
  displayMore: boolean = false;
  inputControl = new FormControl();
  private searchTerms = new Subject<string>();

  constructor(private userService: UserService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // this.users$ = this.inputControl.valueChanges.pipe(
    //   map(value => (typeof value === 'string' ? value : value.firstName)),
    //   map(name => (name ? this._filter(name) : this.options.slice()))
    // );
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      tap(term => {
        this.searchText = term;
      }),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchUsers(term))
    );
  }

  displayFn(user?: any): string | undefined {
    return user ? `${user.firstName}` : undefined; // ${user.lastName}
  }

  searchUsers() {
    this.performedSearch.emit(this.searchText);
  }
}
