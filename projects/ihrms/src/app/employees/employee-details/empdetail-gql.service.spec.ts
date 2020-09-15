import { TestBed } from '@angular/core/testing';

import { EmpdetailGQLService } from './empdetail-gql.service';

describe('EmpdetailGQLService', () => {
  let service: EmpdetailGQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpdetailGQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
