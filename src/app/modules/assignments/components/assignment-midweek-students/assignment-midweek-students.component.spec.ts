import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMidweekStudentsComponent } from './assignment-midweek-students.component';

describe('AssignmentMidweekStudentsComponent', () => {
  let component: AssignmentMidweekStudentsComponent;
  let fixture: ComponentFixture<AssignmentMidweekStudentsComponent>;

  beforeEach(async(() => {
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
