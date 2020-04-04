import * as faker from 'faker'; // /locale/en_US'

import { Part } from '../models/part/part.schema';
// import { Part } from '../models/parts.schema';

/**
 * Available values for meeting parts
 * put here so that ngx-translate could locate and add them to
 * the translation files
 */
export const partMocks: Part[] = [
  {
    _id: faker.random.uuid(),
    name: 'clm.chairman',
    meeting: 'midweek',
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.prayer',
    meeting: 'midweek',
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.treasures.talk',
    meeting: 'midweek-treasures',
    withTitle: true,
    byAnOverseer: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.treasures.digging',
    meeting: 'midweek-treasures',
    byAnOverseer: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.treasures.bible-reading',
    meeting: 'midweek-treasures',
    byABrother: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.ministry.initial-call',
    meeting: 'midweek-students',
    withAssistant: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.ministry.return-visit',
    meeting: 'midweek-students',
    withAssistant: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.ministry.bible-study',
    meeting: 'midweek-students',
    withAssistant: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.ministry.talk',
    meeting: 'midweek-students',
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.ministry.assistant',
    meeting: 'midweek-students',
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.christianLiving.talks',
    meeting: 'midweek-christianLiving',
    withTitle: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.christianLiving.congregation-bible-study',
    meeting: 'midweek-christianLiving',
  },
  {
    _id: faker.random.uuid(),
    name: 'clm.christianLiving.congregation-bible-study-reader',
    meeting: 'midweek-christianLiving',
  },
  {
    _id: faker.random.uuid(),
    name: 'weekend.publicTalk.chairman',
    meeting: 'weekend-publicTalk',
    byAnOverseer: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'weekend.publicTalk.speaker',
    meeting: 'weekend-publicTalk',
    byAnOverseer: true,
  },
  {
    _id: faker.random.uuid(),
    name: 'weekend.watchtower.conductor',
    meeting: 'weekend-watchtower',
  },
  {
    _id: faker.random.uuid(),
    name: 'weekend.watchtower.reader',
    meeting: 'weekend-watchtower',
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
