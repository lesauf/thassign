import { TestBed } from '@angular/core/testing';

import { AssignmentControlService } from '@src/app/modules/assignments/assignment-control.service';

describe('AssignmentControlService', () => {
  let service: AssignmentControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
