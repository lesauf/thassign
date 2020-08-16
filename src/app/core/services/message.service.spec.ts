import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MessageService } from '@src/app/core/services/message.service';
import { StitchService } from '@src/app/core/services/stitch.service';

describe('MessageService', () => {
  let MessageServiceSpectator: SpectatorService<MessageService>;

  const createService = createServiceFactory({
    service: MessageService,
    mocks: [],
    providers: [],
  });

  beforeEach(async () => {
    MessageServiceSpectator = createService();
  });

  test('created and able to add and clear messages', async () => {
    expect(MessageServiceSpectator.service).toBeTruthy();

    expect(MessageServiceSpectator.service.messages.length).toBe(0);

    MessageServiceSpectator.service.add('Un nouveau message');
    expect(MessageServiceSpectator.service.messages.length).toBe(1);

    MessageServiceSpectator.service.clear();
    expect(MessageServiceSpectator.service.messages.length).toBe(0);
  });
});
