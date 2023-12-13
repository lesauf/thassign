import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaComponent } from '@src/app/layouts/content-layout/content-layout.component';

describe('MaComponent', () => {
  let component: MaComponent;
  let fixture: ComponentFixture<MaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MaComponent],
    teardown: { destroyAfterEach: false }
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
