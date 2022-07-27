import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportEpubComponent } from '@src/app/shared/components/import-epub/import-epub.component';

describe('ImportEpubComponent', () => {
  let component: ImportEpubComponent;
  let fixture: ComponentFixture<ImportEpubComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ImportEpubComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEpubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
