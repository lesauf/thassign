import { TestBed } from '@angular/core/testing';

import { AssignmentService } from '@src/app/modules/assignments/services/assignment.service';

describe('AssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssignmentService = TestBed.inject(AssignmentService);
    expect(service).toBeTruthy();
  });
});
