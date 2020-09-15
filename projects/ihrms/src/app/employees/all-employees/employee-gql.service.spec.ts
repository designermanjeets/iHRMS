import { TestBed } from '@angular/core/testing';

import { EmployeeGQLService } from './employee-gql.service';

describe('EmployeeGQLService', () => {
  let service: EmployeeGQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeGQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
