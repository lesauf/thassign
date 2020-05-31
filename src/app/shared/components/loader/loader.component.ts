import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.scss'],
})
export class LoaderComponent {
  @Input() message: string = '';
}
