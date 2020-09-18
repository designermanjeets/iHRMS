import { TestBed } from '@angular/core/testing';

import { HolidaysGQLService } from './holidays-gql.service';

describe('HolidaysGQLService', () => {
  let service: HolidaysGQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidaysGQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
