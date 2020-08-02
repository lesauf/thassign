import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AuthService } from './auth.service';
import { StitchService } from 'src/app/core/services/stitch.service';

describe('AuthService', () => {
  let AuthServiceSpectator: SpectatorService<AuthService>;

  const createService = createServiceFactory({
    service: AuthService,
    mocks: [
      // StitchService
    ],
    providers: [
      {
        provide: RealmService,
        useValue: {
          authenticate: () => Promise.resolve(true),
          getCollectionByName: () => Promise.resolve(null),
          getDbService: () => {},
          getServiceWebHookUrl: () => '',
        },
      },
    ],
  });

  beforeEach(async () => {
    AuthServiceSpectator = createService();
  });

  test('created', async () => {
    expect(AuthServiceSpectator.service).toBeTruthy();
  });
});
