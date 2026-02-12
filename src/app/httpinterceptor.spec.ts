import { TestBed } from '@angular/core/testing';

import { Httpinterceptor } from './httpinterceptor';

describe('Httpinterceptor', () => {
  let service: Httpinterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Httpinterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
