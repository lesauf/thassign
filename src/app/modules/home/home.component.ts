import { Component } from '@angular/core';

import { PartServiceStitch } from 'src/app/core/services/part.service.stitch';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  public parts: any;

  constructor(public partServiceStitch: PartServiceStitch) {
    // console.log(this.partServiceStitch.getAllParts());
    this.partServiceStitch.getAllParts().then((parts) => {
      this.parts = parts;
      console.log(parts);
    });

    this.partServiceStitch.getPartsNames().then((partsNames) => {
      console.log('Parts names :', partsNames);
    });
  }
}
