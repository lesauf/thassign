import { FormBuilder } from '@angular/forms';

export class AssignmentForm {
  public WeekendForm = this.fb.group({
    chairman: this.fb.group({
      _id: [''],
      week: [''],
      assignee: ['']
    }),
    speaker: this.fb.group({
      _id: [''],
      week: [''],
      assignee: [''],
      title: [''],
      number: ['']
    }),
    reader: this.fb.group({
      _id: [''],
      week: [''],
      assignee: ['']
    })
  });

  constructor(private fb: FormBuilder) {}
}
