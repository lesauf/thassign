import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignableListComponent } from './assignable-list.component';

describe('AssignableListComponent', () => {
  let component: AssignableListComponent;
  let fixture: ComponentFixture<AssignableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
