import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StitchService } from './stitch.service';

describe('StitchService', () => {
  let StitchServiceSpectator: SpectatorService<StitchService>;

  const createService = createServiceFactory({
    service: StitchService,
    mocks: [],
    providers: [],
  });

  beforeEach(async () => {
    StitchServiceSpectator = createService();
  });

  test('created', async () => {
    expect(StitchServiceSpectator.service).toBeTruthy();
  });
});
