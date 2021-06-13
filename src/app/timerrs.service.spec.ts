import { TestBed } from '@angular/core/testing';

import { TimerrsService } from './timerrs.service';

describe('TimerrsService', () => {
  let service: TimerrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
