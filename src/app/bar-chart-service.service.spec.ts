import { TestBed } from '@angular/core/testing';

import { BarChartService } from './bar-chart-service.service';

describe('BarChartService', () => {
  let service: BarChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
