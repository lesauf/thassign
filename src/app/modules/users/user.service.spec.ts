// import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
// import { TranslateService } from '@ngx-translate/core';

// import { UserService } from './user.service';
// import { StitchService } from 'src/app/core/services/stitch.service';
// import { PartService } from 'src/app/core/services/part.service';
// import { partMocks } from 'src/app/core/mocks/parts.mock';
// import { generateUsers } from 'src/app/core/mocks/users.mock';

// describe('UserService', () => {
//   let UserServiceStitchSpectator: SpectatorService<UserService>;

//   const createService = createServiceFactory({
//     service: UserService,
//     mocks: [TranslateService],
//     providers: [
//       PartService,
//       {
//         provide: RealmService,
//         useValue: {
//           authenticate: () => Promise.resolve(true),
//           getCollectionByName: () => Promise.resolve(null),
//           getDbService: () => {},
//           getServiceWebHookUrl: () => '',
//         },
//       },
//     ],
//   });

//   beforeEach(async () => {
//     UserServiceStitchSpectator = createService();

//     UserServiceStitchSpectator.service.storeUsers(generateUsers, partMocks);

//     // spyOn(UserServiceStitchSpectator.service, 'getUsers').and.returnValue(
//     //   Promise.resolve(userMocks)
//     // );
//   });

//   test('created and the list of users is of User objects', async () => {
//     expect(UserServiceStitchSpectator.service).toBeTruthy();

//     expect(UserServiceStitchSpectator.service.getUsers().length).toEqual(
//       userMocks.length
//     );

//     // Check that we actually have User objects
//     const firstUser = UserServiceStitchSpectator.service.getUsers()[0];

//     expect(firstUser.constructor.name).toEqual('User');
//   });

//   test('is able to filter and group by meeting', async () => {
//     const users: any[] = UserServiceStitchSpectator.service.getUsersByMeeting(
//       'midweek-students'
//     );
//     // check the nomber of keys of the returned object
//     expect(Object.keys(users).length).toEqual(5);

//     const usersbyMeeting = UserServiceStitchSpectator.service.getUsersGroupedByMeeting();
//     expect(Object.keys(usersbyMeeting).length).toEqual(2); // [ 'users', 'meetings' ];
//   });
// });
