import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';

// import { any } from '../../../../../../server/src/modules/users/user.schema';
// import { User } from 'src/app/models/users.schema';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { UserService } from '../../user.service';
import { UserSortComponent } from '../../components/user-sort/user-sort.component';
import { User } from 'src/app/core/models/user/user.model';
import { PartService } from 'src/app/core/services/part.service';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  // styleUrls: ['user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: User[];
  /**
   * State of the master checkbox
   */
  masterChecked = false;
  // State of all checkboxes
  noUserChecked = true;
  display = 'grid'; // 'grid' or 'list'
  sort = 'firstName';
  sortOrder = 'asc';
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [1, 2, 5, 10, 25, 100];
  usersTotal: number;
  filters = ''; // TODO: retrieve value from input field in component UserFilter

  // MatPaginator Output
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

  @ViewChildren(MatCheckbox) usersCheckboxes: QueryList<MatCheckbox>;

  constructor(
    private router: Router,
    private userService: UserService,
    private partService: PartService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.partService.init();
    this.getUsers();
  }

  ngAfterViewInit(): void {
    // Handle paginators

    this.paginators.forEach((paginator) => {
      paginator.page
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
  }

  async generateUsers() {
    await this.userService.generateUsers(10);

    // usersRequest.subscribe((res) => {
    // Refresh the grid
    this.getUsers();
    // });
  }

  /**
   * Fetch users from db and
   * display them in the paginated grid
   */
  async getUsers(paginator?: MatPaginator) {
    // Clear users list to display the loader
    this.users = null;

    const res = await this.userService.getUsers(
      this.sort,
      this.sortOrder,
      paginator !== undefined ? paginator.pageSize : this.pageSize,
      paginator !== undefined ? paginator.pageIndex : this.pageIndex,
      this.filters
    );

    this.users = res.docs;
    this.usersTotal = res.totalDocs;

    // Handle users checkboxes
    // this.handleCheckboxes();
    this.usersCheckboxes.forEach((c, index, usersCheckboxes) => {
      // Do not handle the first (master)
      if (index !== 0) {
        c.change.subscribe(() => {
          this.handleCheckboxes();
        });
      }
    });
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
    this.filters = searchTerms;
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
      this.userService.state = user;
    }

    // console.log('State: ', this.userService.state);
    // console.log('State2: ', this.userService.state);
    this.router.navigate([path]);
  }

  getPartName(partId) {
    return this.partService.getPartName(partId);
  }

  async delete(userId?: string[]) {
    try {
      await this.userService.softDeleteUsers(userId);
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
        sort: this.sort,
      },
    });
    dialogRef.afterClosed().subscribe((sort) => {
      if (sort && this.sort !== sort) {
        this.sort = sort;
        this.getUsers();
      }
    });
  }

  async toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.getUsers();
  }
}
