import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignmentWeekendComponent } from '@src/app/modules/assignments/components/assignment-weekend/assignment-weekend.component';

describe('AssignmentWeekendComponent', () => {
  let component: AssignmentWeekendComponent;
  let fixture: ComponentFixture<AssignmentWeekendComponent>;

  beforeEach(waitForAsync(() => {
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
