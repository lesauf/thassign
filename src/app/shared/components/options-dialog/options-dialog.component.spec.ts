import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptionsDialogComponent } from '@src/app/shared/components/options-dialog/options-dialog.component';

describe('OptionsDialogComponent', () => {
  let component: OptionsDialogComponent;
  let fixture: ComponentFixture<OptionsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
