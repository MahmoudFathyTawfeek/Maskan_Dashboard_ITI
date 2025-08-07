import { TestBed } from '@angular/core/testing';

import { AddBooking } from './add-booking';

describe('AddBooking', () => {
  let service: AddBooking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddBooking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
