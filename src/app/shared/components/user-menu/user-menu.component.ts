import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';
import { AuthService } from '@src/app/modules/auth/auth.service';

import { User } from '@src/app/core/models/user/user.model';

@Component({
  selector: 'ma-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  isOpen = false;

  @Input() currentUser: User = null;

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  constructor(
    private authService: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
  }
}
