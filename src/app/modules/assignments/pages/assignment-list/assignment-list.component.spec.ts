import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignmentListComponent } from '@src/app/modules/assignments/pages/assignment-list/assignment-list.component';

describe('AssignmentListComponent', () => {
  let component: AssignmentListComponent;
  let fixture: ComponentFixture<AssignmentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
