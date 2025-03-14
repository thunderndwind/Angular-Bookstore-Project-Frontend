import { TestBed } from '@angular/core/testing';

import { DetailsServices } from './details.service';

describe('DetailsServices', () => {
  let service: DetailsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
