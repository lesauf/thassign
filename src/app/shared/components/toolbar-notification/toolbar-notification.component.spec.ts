import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarNotificationComponent } from '@src/app/shared/components/toolbar-notification/toolbar-notification.component';

describe('ToolbarNotificationComponent', () => {
  let component: ToolbarNotificationComponent;
  let fixture: ComponentFixture<ToolbarNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ToolbarNotificationComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
