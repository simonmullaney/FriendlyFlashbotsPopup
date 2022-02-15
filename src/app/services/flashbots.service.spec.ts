import { TestBed } from '@angular/core/testing';

import { FlashbotsServiceService } from './flashbots.service';

describe('FlashbotsService', () => {
  let service: FlashbotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashbotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
