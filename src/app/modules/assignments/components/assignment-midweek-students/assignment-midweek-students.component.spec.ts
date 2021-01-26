import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignmentMidweekStudentsComponent } from '@src/app/modules/assignments/components/assignment-midweek-students/assignment-midweek-students.component';

describe('AssignmentMidweekStudentsComponent', () => {
  let component: AssignmentMidweekStudentsComponent;
  let fixture: ComponentFixture<AssignmentMidweekStudentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssignmentMidweekStudentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentMidweekStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
