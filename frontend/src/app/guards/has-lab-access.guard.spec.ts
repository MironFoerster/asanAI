import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasLabAccessGuard } from './has-lab-access.guard';

describe('hasLabAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hasLabAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
