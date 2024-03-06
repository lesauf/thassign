import { TestBed } from '@angular/core/testing';

import { PartService } from '@src/app/core/services/part.service';

describe('PartService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: PartService = TestBed.inject(PartService);
    expect(service).toBeTruthy();
  });
});
