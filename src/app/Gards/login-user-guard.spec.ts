import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginUserGuard } from './login-user-guard';

describe('loginUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
