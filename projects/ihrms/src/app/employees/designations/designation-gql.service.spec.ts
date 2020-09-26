import { TestBed } from '@angular/core/testing';

import { DesignationGqlService } from './designation-gql.service';

describe('DesignationGqlService', () => {
  let service: DesignationGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignationGqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
