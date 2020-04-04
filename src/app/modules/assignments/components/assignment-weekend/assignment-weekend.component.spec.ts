import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentWeekendComponent } from './assignment-weekend.component';

describe('AssignmentWeekendComponent', () => {
  let component: AssignmentWeekendComponent;
  let fixture: ComponentFixture<AssignmentWeekendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentWeekendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentWeekendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
