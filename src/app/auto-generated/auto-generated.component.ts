import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-generated',
  templateUrl: './auto-generated.component.html',
  styleUrls: ['./auto-generated.component.scss'],
})
export class AutoGeneratedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  greet() {
    alert('Oi');
    console.log('He from the console');
  }
}