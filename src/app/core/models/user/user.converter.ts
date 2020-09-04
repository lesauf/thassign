import { User } from '@src/app/core/models/user/user.model';

export class UserConverter {
  /**
   * Change nothing here, the prepareToSave method of user handle this already
   * @param user User
   */
  toFirestore(user: User) {
    return user.toObject();
  }

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    console.log(data);
    return new User(data);
  }
}
