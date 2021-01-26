import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthPickerComponent } from '@src/app/shared/components/month-picker/month-picker.component';

describe('MonthPickerComponent', () => {
  let component: MonthPickerComponent;
  let fixture: ComponentFixture<MonthPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
