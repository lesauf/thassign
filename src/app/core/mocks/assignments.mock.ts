// import * as faker from 'faker'; // /locale/en_US'

// // import { PARTS } from './parts.mock';

// import { PartService } from '../services/part.service';
// import { UserService } from '../../modules/users/user.service';
// import { User } from '../models/user/user.model';
// import { Part } from '../models/part/part.model';
// import { Assignment } from '../models/assignment/assignment.model';
// import { DateTime } from 'luxon';

// export const assignment = (user: User, part: Part, week: string) => {
//   const _id = faker.random.uuid();
//   // const part = faker.random.arrayElement(PARTS);

//   return {
//     // id: _id, // same as _id for in_memory_db_service
//     week: DateTime.fromISO(week),
//     part: part,
//     assignee: user
//   } as Assignment;
// };

// export const generateAssignments = (users: User[], parts: Part[]) => {
//   const res = [];

//   const weeks = [
//     '2019-01-14',
//     '2019-01-21',
//     '2019-01-28',
//     '2019-02-04',
//     '2019-02-11'
//   ];

//   // Generate all assignments for each week
//   weeks.forEach(week => {
//     parts.forEach(part => {
//       const usersOfThisPart = users.filter(
//         u =>
//           u.parts.find(availablePart => availablePart.name === part.name) !==
//           undefined
//       );
//       // randomly choose a user from the approved list ...
//       const user = faker.random.arrayElement(usersOfThisPart);

//       const sAssignment = assignment(user, part, week);

//       res.push(sAssignment);
//     });
//   });

//   return res;
// };
