import { TestBed } from '@angular/core/testing';

import { CloudinaryApi } from './cloudinary-api';

describe('CloudinaryApi', () => {
  let service: CloudinaryApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
