import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

import { PartService } from '@src/app/core/services/part.service';
import { StitchService } from '@src/app/core/services/stitch.service';
import { partMocks } from '@src/app/core/mocks/parts.mock';

describe('PartService', () => {
  let PartServiceStitchSpectator: SpectatorService<PartService>;

  const createService = createServiceFactory({
    service: PartService,
    mocks: [TranslateService],
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
    PartServiceStitchSpectator = createService();

    PartServiceStitchSpectator.service.storeParts(partMocks);

    // spyOn(PartServiceStitchSpectator.service, 'getParts').and.returnValue(
    //   Promise.resolve(partMocks)
    // );
  });

  test('created and the list of parts is of Part objects', async () => {
    expect(PartServiceStitchSpectator.service).toBeTruthy();

    expect(PartServiceStitchSpectator.service.getParts().length).toEqual(
      partMocks.length
    );

    // Check that we actually have Part objects
    const firstPart = PartServiceStitchSpectator.service.getParts()[0];

    expect(firstPart.constructor.name).toEqual('Part');
  });

  test('is able to filter and group by meeting', async () => {
    const parts: any[] = PartServiceStitchSpectator.service.getPartsByMeeting(
      'midweek-students'
    );
    // check the nomber of keys of the returned object
    expect(Object.keys(parts).length).toEqual(5);

    const partsbyMeeting = PartServiceStitchSpectator.service.getPartsGroupedByMeeting();
    expect(Object.keys(partsbyMeeting).length).toEqual(2); // [ 'parts', 'meetings' ];
  });
});
