import { TestBed } from '@angular/core/testing';

import { AppResolverService } from '@src/app/app-resolver.service';

describe('AppResolverService', () => {
  let service: AppResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
