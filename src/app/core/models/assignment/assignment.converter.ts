import { Assignment } from '@src/app/core/models/assignment/assignment.model';

export class AssignmentConverter {
  /**
   * Change nothing here, the prepareToSave method of assignment handle this already
   * @param assignment Assignment
   */
  toFirestore(assignment: Assignment) {
    return assignment.toObject();
  }

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    console.log(data);
    return new Assignment(data);
  }
}
