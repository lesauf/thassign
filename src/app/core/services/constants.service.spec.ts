import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ConstantsService } from './constants.service';
describe('ConstantsService', () => {
  let service: ConstantsService;
  let ConstantsServiceSpectator: SpectatorService<ConstantsService>;

  const createService = createServiceFactory(ConstantsService);

  beforeEach(async () => {
    ConstantsServiceSpectator = createService();
  });

  test('should be created', () => {
    expect(ConstantsServiceSpectator.service).toBeTruthy();
  });

  test('StitchAppClient, db and webHookClientUrl should be defined', () => {
    expect(ConstantsServiceSpectator.service.stitchAppClient).toBeTruthy();

    expect(ConstantsServiceSpectator.service.db).toBeTruthy();

    expect(service.webHookClientUrl).toEqual(
      'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/'
    );
  });

  test('Stitch methods should exists', () => {
    expect(ConstantsServiceSpectator.service).toHaveProperty('authenticate');

    expect(ConstantsServiceSpectator.service).toHaveProperty(
      'getCollectionByName'
    );

    expect(ConstantsServiceSpectator.service).toHaveProperty('getDbService');

    expect(
      ConstantsServiceSpectator.service.getServiceWebHookUrl('PartService')
    ).toEqual(
      'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/service/PartService/incoming_webhook/'
    );
  });
});
