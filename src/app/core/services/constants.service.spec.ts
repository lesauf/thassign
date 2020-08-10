import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StitchService } from '@src/app/core/services/stitch.service';
describe('StitchService', () => {
  let service: StitchService;
  let StitchServiceSpectator: SpectatorService<StitchService>;

  const createService = createServiceFactory(StitchService);

  beforeEach(async () => {
    StitchServiceSpectator = createService();
  });

  test('should be created', () => {
    expect(StitchServiceSpectator.service).toBeTruthy();
  });

  test('StitchAppClient, db and webHookClientUrl should be defined', () => {
    expect(StitchServiceSpectator.service.stitchAppClient).toBeTruthy();

    expect(StitchServiceSpectator.service.db).toBeTruthy();

    expect(service.webHookClientUrl).toEqual(
      'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/'
    );
  });

  test('Stitch methods should exists', () => {
    expect(StitchServiceSpectator.service).toHaveProperty('authenticate');

    expect(StitchServiceSpectator.service).toHaveProperty(
      'getCollectionByName'
    );

    expect(StitchServiceSpectator.service).toHaveProperty('getDbService');

    expect(
      StitchServiceSpectator.service.getServiceWebHookUrl('PartService')
    ).toEqual(
      'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/service/PartService/incoming_webhook/'
    );
  });
});
