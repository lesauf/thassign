import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { menus } from './menu-element';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  /**
   *
   * @description     		Property that stores the selected language value from the  component
   */
  language: string;

  @Input() iconOnly: boolean = false;
  
  public menus = menus;
  
  /**
     * Emit event to close sidenav on menu select
     */
  @Output() onMenuSelected: EventEmitter<boolean> = new EventEmitter();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.language = this.translate.currentLang;
  }

  /**
     * Emit an event to close the drawer when menu is clicked
     */
  menuSelected() {
    this.onMenuSelected.emit(true);
  }

  /**
   * Capture the selected language from the  component
   *
   * @method changeLanguage
   */
  public changeLanguage(): void {
    this.translate.use(this.language);
  }
}
