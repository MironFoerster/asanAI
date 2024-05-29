import { TestBed } from '@angular/core/testing';

import { ModelControlsService } from './model-controls.service';

describe('ModelControlsService', () => {
  let service: ModelControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
