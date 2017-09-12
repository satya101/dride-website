import { TestBed, inject } from '@angular/core/testing';

import { CloudPaginationService } from './cloud-pagination.service';

describe('CloudPaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudPaginationService]
    });
  });

  it('should be created', inject([CloudPaginationService], (service: CloudPaginationService) => {
    expect(service).toBeTruthy();
  }));
});
