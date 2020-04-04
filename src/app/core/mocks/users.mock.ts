// import * as faker from 'faker'; // /locale/en_US'

// import { User } from '../models/users.schema';
// import { generateParts } from './parts.mock';
// import { Assignment } from '../models/assignments.schema';

// const usersNumber = faker.random.number(50);
// export const user = () => {
//   const _id = faker.random.uuid();
//   const genre = faker.random.arrayElement(['man', 'woman']);
//   const child = faker.random.boolean();
//   const baptized = faker.random.boolean();
//   const publisher = faker.random.boolean();

//   return {
//     id: _id, // same as _id for in_memory_db_service
//     _id: _id,
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     baptized: baptized,
//     publisher: publisher,
//     genre: genre,
//     child: child,
//     phone: !child ? faker.phone.phoneNumber() : null,
//     email: !child ? faker.internet.email() : null,
//     overseer:
//       genre === 'man' && baptized && !child && publisher
//         ? faker.random.arrayElement(['elder', 'ministerial-servant'])
//         : null,
//     disabled: faker.random.boolean(),
//     createdAt: faker.date.past(),
//     parts: generateParts(), // Parts names
//     assignments: [],
//     type: '', // generated from 'man' | 'woman' | 'boy' | 'girl'
//     progress: '' // generated from 'unbaptized' | 'not-publisher'
//   } as User;
// };

// export const generateUsers = (count = usersNumber) => {
//   const users = [];

//   for (let i = 1; i <= count + 1; i++) {
//     const sUser = user();
//     users.push(sUser);
//   }

//   users.forEach((element, index) => {
//     switch (element.genre) {
//       case 'man':
//         if (element.child) {
//           element.type = 'boy';
//         } else if (element.overseer === 'elder') {
//           element.type = 'elder';
//         } else if (element.overseer === 'ministerial-servant') {
//           element.type = 'ministerial-servant';
//         } else {
//           element.type = 'man';
//         }
//         break;
//       default:
//         element.type = element.child ? 'girl' : 'woman';
//         break;
//     }

//     if (!element.publisher) {
//       element.progress = 'not-publisher';
//     } else {
//       if (!element.baptized) {
//         element.progress = 'unbaptized-publisher';
//       }
//     }

//     // unbaptized, non publisher, child and woman can not be overseer
//     if (
//       !element.baptized ||
//       !element.publisher ||
//       element.child ||
//       element.genre === 'woman'
//     ) {
//       element.overseer = null;
//     }

//     users[index] = element;
//   });

//   return users;
// };
