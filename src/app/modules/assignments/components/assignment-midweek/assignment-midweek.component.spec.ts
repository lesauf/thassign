import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignmentMidweekComponent } from '@src/app/modules/assignments/components/assignment-midweek/assignment-midweek.component';

describe('AssignmentMidweekComponent', () => {
  let component: AssignmentMidweekComponent;
  let fixture: ComponentFixture<AssignmentMidweekComponent>;

  beforeEach(waitForAsync(() => {
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
