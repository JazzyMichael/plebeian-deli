import { TestBed } from '@angular/core/testing';

import { PrimeCutsService } from './prime-cuts.service';

describe('PrimeCutsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrimeCutsService = TestBed.get(PrimeCutsService);
    expect(service).toBeTruthy();
  });
});
