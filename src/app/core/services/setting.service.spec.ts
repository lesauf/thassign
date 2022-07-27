import { TestBed } from '@angular/core/testing';

import { SettingService } from '@src/app/core/services/setting.service';

describe('SettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: SettingService = TestBed.inject(SettingService);
    expect(service).toBeTruthy();
  });
});
