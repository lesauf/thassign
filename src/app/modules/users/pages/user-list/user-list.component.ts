import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyCheckbox as MatCheckbox } from '@angular/material/legacy-checkbox';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { tap } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';

// import { any } from '../../../../../../server/src/modules/users/user.schema';
// import { User } from '@src/app/models/users.schema';
import { UserDetailComponent } from '@src/app/modules/users/components/user-detail/user-detail.component';
import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';
import { UserService } from '@src/app/modules/users/user.service';
import { UserSortComponent } from '@src/app/modules/users/components/user-sort/user-sort.component';
import { User } from '@src/app/core/models/user/user.model';
import { PartService } from '@src/app/core/services/part.service';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  // styleUrls: ['user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: User[];

  /**
   * All users from the DB
   */
  // users$: Observable<User[]>;

  /**
   * paginated Users
   */
  pUsers$: Observable<User[]>;

  /**
   * State of the master checkbox
   */
  masterChecked = false;
  // State of all checkboxes
  noUserChecked = true;
  display = 'grid'; // 'grid' or 'list'
  sortField = 'firstName';
  sortOrder = 'asc';
  /**
   * Number of total users filtered
   */
  dataLength = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [1, 2, 5, 10, 25, 100];
  usersTotal: number;
  searchTerm = '';

  // MatPaginator Output
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;
  pageEvent: PageEvent;

  @ViewChildren(MatCheckbox) usersCheckboxes: QueryList<MatCheckbox>;

  constructor(
    private router: Router,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private partService: PartService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userService.data.subscribe((users) => {
      this.users = users;
      this.pUsers$ = this.userService.pUsers;
    });

    // TODO see if it is possible to get the last assignment of each user
    // combineLatest([this.userService.data, this.assignmentService.data])
    //   .subscribe(([users, assignments]) => {
    //   if (users !== null && assignments !== null) {
    //     this.assignmentService.groupAssignmentsByUser(assignments, users);
    //     console.log(this.assignmentService.assignmentsByUser);
    //   }
    // });

    this.getUsers();
  }

  ngAfterViewInit(): void {
    // Handle paginators
    let obsForPagination;
    this.paginators.forEach((paginator) => {
      merge(paginator.page, this.userService.data)
        .pipe(
          tap(() => {
            this.getUsers(paginator);
            this.pageSize = paginator.pageSize;
            this.pageIndex = paginator.pageIndex;
          })
        )
        .subscribe();
    });

    // Handle master checkbox

    this.usersCheckboxes.first.change.subscribe(() => {
      this.masterChecked = this.usersCheckboxes.first.checked;
      this.noUserChecked = !this.masterChecked;
    });

    // this.getUsers();
  }

  async generateUsers() {
    await this.userService.generateUsers(10, this.partService.getParts());
  }

  // addUser() {
  //   this.userService.testOs();
  // }

  /**
   * Fetch users from db and
   * display them in the paginated grid
   */
  getUsers(paginator?: MatPaginator): void {
    // Clear users list to display the loader
    this.users = null;

    this.userService.sortField = this.sortField;
    this.userService.sortOrder = this.sortOrder;
    this.userService.pageSize =
      paginator !== undefined ? paginator.pageSize : this.pageSize;
    this.userService.pageIndex =
      paginator !== undefined ? paginator.pageIndex : this.pageIndex;
    this.userService.searchTerm = this.searchTerm;

    this.dataLength = this.userService.paginateUsers();

    // Handle users checkboxes
    // this.usersCheckboxes.forEach((c, index, usersCheckboxes) => {
    //   // Do not handle the first (master)
    //   if (index !== 0) {
    //     c.change.subscribe(() => {
    //       this.handleCheckboxes();
    //     });
    //   }
    // });
  }

  /**
   * Called on every toggle of checkboxes
   * to toggle also the master checkbox and delete button
   */
  handleCheckboxes() {
    // If all are checked check the master too
    this.usersCheckboxes.first.checked = this.usersCheckboxes
      .toArray()
      .slice(1)
      .every((checkbox, i) => checkbox.checked);
    // this.masterChecked = this.usersCheckboxes.first.checked;
    // If all are unchecked, disable the delete button
    this.noUserChecked = !this.usersCheckboxes.some((_, i) => _.checked);
  }

  /**
   * Perform a search from the filter input
   */
  searchByName(searchTerms: string) {
    this.searchTerm = searchTerms;

    this.pageIndex = 0; // Set the paginator pack to the first page
    this.getUsers();
  }

  /**
   * Improve performance of ngFor directive by specifying the key for uniqueness
   * in case we need to update the list
   * @see https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
   *
   */
  trackById(index, item) {
    return item._id;
  }

  // goto(event, user: any): void {
  //   this.router.navigateByUrl(`user/details/${user._id}`);
  // }

  goto(path: string, user?: User): void {
    if (user) {
      this.userService.currentUser = user;
    }

    this.router.navigate([path]);
  }

  async delete(userId?: string | string[]) {
    try {
      await this.userService.deleteUser(userId);
      // Refresh the list
      this.getUsers();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return the list of checked users
   * skipping the master checkbox
   */
  getCheckedUsers(): any[] {
    return this.usersCheckboxes
      .filter((c, i) => i !== 0 && c.checked) // List of checked
      .map((c) => c.value); // Return the value (user)
  }

  // Handle view user detail button
  async userDetailsModal(event: any, user: any) {
    // display UserDetailComponent in a modal
  }

  // Handle user edit button
  async userEditModal(event, user: any) {
    // display UserEditComponent in a modal
  }

  switchDisplay() {
    switch (this.display) {
      case 'grid':
        this.display = 'list';
        break;
      default:
        this.display = 'grid';
    }
  }

  /**
   * open a dialog with details of a user
   */
  openView(evt: Event, user: User) {
    this.dialog.open(UserDetailComponent, {
      data: {
        user: user,
      },
    });
  }

  // Call the sort field dialog
  openSort(evt: Event): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(UserSortComponent, {
      data: {
        trigger: target,
        sort: this.sortField,
      },
    });
    dialogRef.afterClosed().subscribe((sort) => {
      if (sort && this.sortField !== sort) {
        this.sortField = sort;
        this.getUsers();
      }
    });
  }

  async toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.getUsers();
  }
}
