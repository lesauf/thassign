import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'ma-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;

  // currentUser = null;
  Hari;

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

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}
}
