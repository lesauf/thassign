import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormAssignmentComponent } from './dynamic-form-assignment.component';

describe('DynamicFormAssignmentComponent', () => {
  let component: DynamicFormAssignmentComponent;
  let fixture: ComponentFixture<DynamicFormAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
