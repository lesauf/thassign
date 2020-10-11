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
    section: 'chairman',
  },
  {
    _id: '',
    name: 'clm.prayer',
    meeting: 'any',
    section: 'prayer',
  },
  {
    _id: '',
    name: 'clm.treasures.talk',
    meeting: 'midweek-treasures',
    section: 'treasures',
    withTitle: true,
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'clm.treasures.digging',
    meeting: 'midweek-treasures',
    section: 'treasures',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'clm.treasures.bible-reading',
    meeting: 'midweek-treasures',
    section: 'treasures',
    byABrother: true,
    position: 0,
  },
  {
    _id: '',
    name: 'clm.ministry.initial-call',
    meeting: 'midweek-students',
    section: 'ministry',
    withAssistant: true,
    position: 1,
  },
  {
    _id: '',
    name: 'clm.ministry.return-visit',
    meeting: 'midweek-students',
    section: 'ministry',
    withAssistant: true,
    position: 2,
  },
  {
    _id: '',
    name: 'clm.ministry.bible-study',
    meeting: 'midweek-students',
    section: 'ministry',
    withAssistant: true,
    position: 3,
  },
  {
    _id: '',
    name: 'clm.ministry.talk',
    meeting: 'midweek-students',
    section: 'ministry',
    position: 4,
  },
  {
    _id: '',
    name: 'clm.ministry.assistant',
    section: 'ministry',
    meeting: 'any',
  },
  {
    _id: '',
    name: 'clm.christianLiving.talks',
    meeting: 'midweek-christianLiving',
    section: 'christianLiving',
    withTitle: true,
  },
  {
    _id: '',
    name: 'clm.christianLiving.congregation-bible-study',
    meeting: 'midweek-christianLiving',
    section: 'christianLiving',
  },
  {
    _id: '',
    name: 'clm.christianLiving.congregation-bible-study-reader',
    meeting: 'midweek-christianLiving',
    section: 'christianLiving',
  },
  {
    _id: '',
    name: 'weekend.publicTalk.chairman',
    meeting: 'weekend-publicTalk',
    section: 'publicTalk',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'weekend.publicTalk.speaker',
    meeting: 'weekend-publicTalk',
    section: 'publicTalk',
    byAnOverseer: true,
  },
  {
    _id: '',
    name: 'weekend.watchtower.conductor',
    meeting: 'weekend-watchtower',
    section: 'watchtower',
  },
  {
    _id: '',
    name: 'weekend.watchtower.reader',
    meeting: 'weekend-watchtower',
    section: 'watchtower',
  },
];
// } else {
//   return await PartModel.find();
// }

// let part: PartSchema;

// export const PARTS: PartType[] = getParts();

// export const generateParts = async (count = faker.random.number(10)) => {
//   const parts = await PartModel.find();
//   const res = [];

//   for (let i = 1; i <= count + 1; i++) {
//     const randomPart = faker.random.arrayElement(parts);
//     res.push(randomPart);
//   }

//   return res;
// };
