import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEpubComponent } from '@src/app/shared/components/import-epub/import-epub.component';

describe('ImportEpubComponent', () => {
  let component: ImportEpubComponent;
  let fixture: ComponentFixture<ImportEpubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportEpubComponent ]
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
