import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportsComponent } from '@src/app/modules/exports/exports.component';

describe('ExportsComponent', () => {
  let component: ExportsComponent;
  let fixture: ComponentFixture<ExportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
