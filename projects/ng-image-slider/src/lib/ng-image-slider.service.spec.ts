import { TestBed } from '@angular/core/testing';
import { NgImageSliderService } from './ng-image-slider.service';

describe('NgImageSliderService', () => {
  let service: NgImageSliderService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ NgImageSliderService ],
    });
    service = TestBed.inject(NgImageSliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
