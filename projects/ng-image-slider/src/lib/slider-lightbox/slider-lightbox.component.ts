import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output, ViewChild
} from '@angular/core';
import { Image } from '../model/image.model';
import { SliderBaseComponent } from '../slider-base.component';

@Component({
  selector: 'slider-lightbox',
  templateUrl: './slider-lightbox.component.html'
})
export class SliderLightboxComponent extends SliderBaseComponent implements OnChanges {
  // for lightbox
  isLightboxActive: boolean = false;
  title: string = '';

  @ViewChild('lightboxDiv') lightboxDiv: ElementRef;
  @ViewChild('lightboxImageDiv') lightboxImageDiv: ElementRef;

  // @Inputs
  @Input()
  set show(enabled: boolean) {
    this.isLightboxActive = enabled;
    if (enabled === true) {
      this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
      this.updateSliderWidth();
    } else {
      this.elementRef.nativeElement.ownerDocument.body.style.overflow = '';
    }
  }
  @Input() showPagination: boolean = false;

  // @Output
  @Output() close = new EventEmitter<any>();

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event?.key) {
      case 'arrowright':
        this.nextImage();
        break;
      case 'arrowleft':
        this.prevImage();
        break;
      case 'escape':
        this.closeLightbox();
        break;
    }
  }

  constructor(private elementRef: ElementRef) {
    super();
  }

  updateImages(images: Image[]) {
    super.updateImages(images);

    if (this.images.length > 0) {
      this.gotoImage(this.selectedIndex ?? 0);
    }
  }

  setActiveImage(index: number, _btn?: boolean): void {
    this.title = this.images[this.selectedIndex]['title'] ?? '';
    super.setActiveImage(index, false);
  }

  updateSliderWidth() {
    if (window && window.innerWidth) {
      super.updateSliderWidth();
    }
  }

  closeLightbox() {
    this.close.emit();
  }
}
