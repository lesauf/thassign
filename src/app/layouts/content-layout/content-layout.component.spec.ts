import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaComponent } from '@src/app/layouts/content-layout/content-layout.component';

describe('MaComponent', () => {
  let component: MaComponent;
  let fixture: ComponentFixture<MaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
