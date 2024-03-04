import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isSpaceMemberGuard } from './is-space-member.guard';

describe('isSpaceMemberGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isSpaceMemberGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
