import * as faker from 'faker'; // /locale/en_US'
import { Part } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';

/**
 * Generate a random number of parts between 1 and 10
 */
const generateParts = (parts: Part[], count = faker.random.number(10)) => {
  const res = [];

  for (let i = 1; i <= count + 1; i++) {
    const randomPart = faker.random.arrayElement(parts);
    res.push(randomPart.name);
  }

  return res;
};

export const generateOneUser = (parts: Part[], ownerId) => {
  // const _id = faker.random.uuid();
  const genre = faker.random.arrayElement(['man', 'woman']);
  const child = faker.random.boolean();
  const baptized = faker.random.boolean();
  const publisher = faker.random.boolean();

  return new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    genre: genre,
    ...(!child && { email: faker.internet.email() }),
    congregation: 'EbwaEnglish',
    baptized: baptized,
    publisher: publisher,
    child: child,
    ...(!child && { phone: faker.phone.phoneNumber() }),
    ...(genre === 'man' &&
      baptized &&
      !child &&
      publisher && {
        overseer: faker.random.arrayElement(['elder', 'ministerial-servant']),
      }),
    parts: generateParts(parts), // Parts names
    assignments: [],
    disabled: false,
    // createdAt: new Date(),
    deleted: false,
    ownerId: ownerId,
  });
};

export const generateUsers = (
  parts: Part[],
  ownerId: string,
  count: any = 50
): User[] => {
  // count = parseInt(count, 10); // Convert to number

  const users = [];

  for (let i = 1; i <= count; i++) {
    const sUser = generateOneUser(parts, ownerId);
    users.push(sUser);
  }

  // @TODO use lookup table @see https://www.oreilly.com/library/view/high-performance-javascript/9781449382308/ch04.html
  users.forEach((element, index) => {
    // if (element.genre === 'man') {
    //   element.type = 'man'; // default value
    //   if (element.child) {
    //     element.type = 'boy';
    //   }
    //   if (element.overseer === 'elder') {
    //     element.type = 'elder';
    //   }
    //   if (element.overseer === 'ministerial-servant') {
    //     element.type = 'ministerial-servant';
    //   }
    // } else {
    //   element.type = element.child ? 'girl' : 'woman';
    // }

    // if (!element.baptized) {
    //   element.progress = 'not-publisher'; // default value
    //   if (element.publisher) {
    //     element.progress = 'unbaptized-publisher';
    //   }
    // }

    // unbaptized, child and woman can not be overseer
    if (!element.baptized || element.child || element.genre === 'woman') {
      delete element.overseer;
    }

    users[index] = element;
  });

  return users;
};
