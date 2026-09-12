import { TestBed } from '@angular/core/testing';

import { Verein } from './verein';

describe('Verein', () => {
  let service: Verein;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Verein);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
