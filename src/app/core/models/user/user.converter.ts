import { User } from '@src/app/core/models/user/user.model';

export class UserConverter {
  toFirestore(user) {
    console.log({
      _id: user._id,
      email: user.email,
      ownerId: user._id,
      deleted: user.deleted,
    });

    return {
      _id: user._id,
      email: user.email,
      ownerId: user._id,
      deleted: user.deleted,
    };
  }

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new User(data);
  }
}
