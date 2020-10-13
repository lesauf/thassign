import { Program } from '@src/app/core/models/program.model';

export class ProgramConverter {
  /**
   * Change nothing here, the toObject() method of program handle this already
   * @param program Program
   */
  toFirestore(program: Program) {
    return program.toObject();
  }

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return new Program(data);
  }
}
