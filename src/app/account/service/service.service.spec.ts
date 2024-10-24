import { TestBed } from '@angular/core/testing';

import { AuthServices } from './service.service';

describe('AuthService', () => {
  let service: AuthServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
