import { User } from '@src/app/core/models/user/user.model';

export class UserConverter {
  toFirestore(user) {
    return {
      _id: user._id,
      email: user.email,
      ownerId: user._id,
      firstName: user.firstName,
      deleted: user.deleted,
    };
  }

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    console.log(data);
    return new User(data);
  }
}
