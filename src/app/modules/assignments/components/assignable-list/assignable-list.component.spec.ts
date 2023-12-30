import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignableListComponent } from '@src/app/modules/assignments/components/assignable-list/assignable-list.component';

describe('AssignableListComponent', () => {
  let component: AssignableListComponent;
  let fixture: ComponentFixture<AssignableListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AssignableListComponent],
    teardown: { destroyAfterEach: false }
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
