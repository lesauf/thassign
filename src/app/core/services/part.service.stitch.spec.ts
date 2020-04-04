import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PartServiceStitch } from './part.service.stitch';
import { ConstantsService } from './constants.service';
import { MessageService } from './message.service';

describe('PartServiceStitch', () => {
  let PartServiceStitchSpectator: SpectatorService<PartServiceStitch>;

  const createService = createServiceFactory({
    service: PartServiceStitch
    // mocks: [],
    // providers: [
    //   {
    //     provide: ConstantsService,
    //     useValue: new ConstantsService()
    //   }
    // ]
  });

  beforeEach(() => {
    PartServiceStitchSpectator = createService();
  });

  it('should be created', () => {
    expect(PartServiceStitchSpectator.service).toBeTruthy();
  });
});
