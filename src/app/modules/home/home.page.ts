import { Component } from '@angular/core';

import { PartServiceStitch } from 'src/app/core/services/part.service.stitch';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public parts: any;

  constructor(public partServiceStitch: PartServiceStitch) {
    // console.log(this.partServiceStitch.getAllParts());
    this.partServiceStitch.getAllParts().then(parts => {
      this.parts = parts;
      console.log(parts.length);
    });
    // this.parts = this.partServiceStitch.getAllParts();
  }
}
