import { TestBed } from '@angular/core/testing';

import { OldUserService } from './old-user.service';

describe('OldUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OldUserService = TestBed.get(OldUserService);
    expect(service).toBeTruthy();
  });
});
