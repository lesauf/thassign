import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'app-sidemenu-item',
    templateUrl: './sidemenu-item.component.html',
    styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent implements OnInit {

    @Input() menu;
    @Input() iconOnly: boolean;
    @Input() secondaryMenu = false;
    /**
     * Emit event to close sidenav on menu select
     */
    @Output() onMenuSelected: EventEmitter<boolean> = new EventEmitter();
    

    constructor() { }

    ngOnInit() {
    }

    openLink() {
        this.menu.open = this.menu.open;
    }

    chechForChildMenu() {
      return (this.menu && this.menu.sub) ? true : false;
    }
    
    /**
     * Emit an event to close the drawer when menu is clicked
     */
    menuSelected() {
      this.onMenuSelected.emit(true);
    }

}
