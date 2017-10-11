import { TestBed, inject } from '@angular/core/testing';

import { SsrService } from './ssr.service';

describe('SsrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SsrService]
    });
  });

  it('should be created', inject([SsrService], (service: SsrService) => {
    expect(service).toBeTruthy();
  }));
});
