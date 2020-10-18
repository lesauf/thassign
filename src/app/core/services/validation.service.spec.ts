import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ValidationService } from '@src/app/core/services/validation.service';

describe('ValidationService', () => {
  let ValidationServiceSpectator: SpectatorService<ValidationService>;

  const createService = createServiceFactory({
    service: ValidationService,
    mocks: [
      // StitchService
    ],
    providers: [],
  });

  beforeEach(async () => {
    ValidationServiceSpectator = createService();
  });

  test('created', async () => {
    expect(ValidationServiceSpectator.service).toBeTruthy();
  });

  test('validate password', async () => {
    expect(
      ValidationService.passwordValidator({ value: 'goodpass1' })
    ).toBeNull();

    expect(
      ValidationService.passwordValidator({ value: 'badpass' }).invalidPassword
    ).toBe(true);
  });
});
