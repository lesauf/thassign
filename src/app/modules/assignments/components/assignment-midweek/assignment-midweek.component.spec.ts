import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMidweekComponent } from './assignment-midweek.component';

describe('AssignmentMidweekComponent', () => {
  let component: AssignmentMidweekComponent;
  let fixture: ComponentFixture<AssignmentMidweekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentMidweekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentMidweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
