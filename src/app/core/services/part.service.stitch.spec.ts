import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PartServiceStitch } from './part.service.stitch';
import { ConstantsService } from './constants.service';
import { partSchema, Part } from '../models/part/part.schema';
import { partMocks } from '../mocks/parts.mock';

describe('PartServiceStitch', () => {
  let PartServiceStitchSpectator: SpectatorService<PartServiceStitch>;

  const createService = createServiceFactory({
    service: PartServiceStitch,
    mocks: [
      // ConstantsService
    ],
    providers: [
      {
        provide: ConstantsService,
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
    PartServiceStitchSpectator = createService();

    spyOn(PartServiceStitchSpectator.service, 'getAllParts').and.returnValue(
      Promise.resolve(partMocks)
    );

    await PartServiceStitchSpectator.service.init();
  });

  test('created and request the list of parts', async () => {
    expect(PartServiceStitchSpectator.service).toBeTruthy();

    expect(PartServiceStitchSpectator.service.allParts).toEqual(partMocks);
    // console.log(PartServiceStitchSpectator.service.allParts.length);
    // console.log(partMocks.length);
  });

  test('filter by meeting', async () => {
    const weekendParts: any[] = PartServiceStitchSpectator.service.getPartsByMeeting(
      'weekend'
    );

    // check the nomber of keys of the returned object
    expect(Object.keys(weekendParts).length).toEqual(4);
  });
});
