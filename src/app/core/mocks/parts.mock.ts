import * as faker from 'faker'; // /locale/en_US'
// import { ObjectId } from 'mongodb';

import { Part } from '@src/app/core/models/part/part.model';

/**
 * Available values for meeting parts
 * put here so that ngx-translate could locate and add them to
 * the translation files
 *
 *
 */
export const partMocks: any[] = [
  {
    _id: '',
    name: 'clm.chairman',
    meeting: 'midweek',
    type: 'general',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'clm.prayer',
    meeting: 'any',
    type: 'general',
    byABrother: true,
  },
  {
    _id: '',
    name: 'clm.talk-or-discussion',
    meeting: 'midweek',
    type: 'talk-or-discussion',
    withTitle: true,
    byAnOverseer: true,
  },
  // {
  //   _id: '',
  //   name: 'clm.treasures.digging',
  //   meeting: 'midweek',
  //   type: 'talk-or-discussion',
  //   byAnOverseer: true,
  // },
  {
    _id: '',
    name: 'clm.treasures.bible-reading',
    meeting: 'midweek',
    type: 'student',
    byABrother: true,
    position: 0,
  },
  {
    _id: '',
    name: 'clm.ministry.initial-call',
    meeting: 'midweek',
    type: 'student',
    withAssistant: true,
    position: 1,
  },
  {
    _id: '',
    name: 'clm.ministry.return-visit',
    meeting: 'midweek',
    type: 'student',
    withAssistant: true,
    position: 2,
  },
  {
    _id: '',
    name: 'clm.ministry.bible-study',
    meeting: 'midweek',
    type: 'student',
    position: 3,
  },
  {
    _id: '',
    name: 'clm.ministry.talk',
    meeting: 'midweek',
    type: 'student',
    byABrother: true,
    position: 4,
  },
  {
    _id: '',
    name: 'clm.ministry.assistant',
    type: 'student',
    meeting: 'any',
  },
  // {
  //   _id: '',
  //   name: 'clm.christianLiving.talks',
  //   meeting: 'midweek',
  //   type: 'talk-or-discussion',
  //   withTitle: true,
  //   byAnOverseer: true,
  // },
  {
    _id: '',
    name: 'clm.christianLiving.congregation-bible-study',
    meeting: 'midweek',
    type: 'talk-or-discussion',
    byAnOverseer: true,
    withReader: true,
  },
  {
    _id: '',
    name: 'clm.reader',
    meeting: 'midweek',
    type: 'general',
  },
  {
    _id: '',
    name: 'weekend.publicTalk.chairman',
    meeting: 'weekend',
    type: 'general',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'weekend.publicTalk.speaker',
    meeting: 'weekend',
    type: 'talk-or-discussion',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'weekend.reader',
    meeting: 'weekend',
    type: 'general',
  },
  {
    _id: '',
    name: 'weekend.watchtower.conductor',
    meeting: 'weekend',
    type: 'talk-or-discussion',
    byAnOverseer: true,
    withReader: true,
  },
];