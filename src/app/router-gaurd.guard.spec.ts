import { TestBed } from '@angular/core/testing';

import { RouterGaurdGuard } from './router-gaurd.guard';

describe('RouterGaurdGuard', () => {
  let guard: RouterGaurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RouterGaurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
