import { DOCUMENT } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input, Output,
    ViewChild
} from '@angular/core';

const LIGHTBOX_NEXT_ARROW_CLICK_MESSAGE = 'lightbox next';
const LIGHTBOX_PREV_ARROW_CLICK_MESSAGE = 'lightbox previous';

@Component({
  selector: 'slider-lightbox',
  templateUrl: './slider-lightbox.component.html'
})
export class SliderLightboxComponent {
  totalImages: number = 0;
  nextImageIndex: number = -1;
  popupWidth: number = 1200;
  marginLeft: number = 0;
  imageFullscreenView: boolean = false;
  lightboxPrevDisable: boolean = false;
  lightboxNextDisable: boolean = false;
  showLoading: boolean = true;
  transitionEffect: string = 'none';
  speed: number = 1; // default speed in second
  title: string = '';
  currentImageIndex: number = 0;

  @ViewChild('lightboxDiv') lightboxDiv: ElementRef;
  @ViewChild('lightboxImageDiv') lightboxImageDiv: ElementRef;

  // @Inputs
  @Input() images: Array<object> = [];
  @Input()
  set imageIndex(index: number) {
    if (index && index > -1 && index < this.images.length) {
      this.currentImageIndex = index;
    }
  }
  @Input()
  set show(visibleFlag: boolean) {
    this.imageFullscreenView = visibleFlag;
    this.elRef.nativeElement.ownerDocument.body.style.overflow = '';
    if (visibleFlag === true) {
      this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
      this.setPopupSliderWidth();
    }
  }
  @Input() direction: string = 'ltr';
  @Input() paginationShow: boolean = false;
  @Input()
  set animationSpeed(data: number) {
    this.speed = data;
  }
  @Input() arrowKeyMove: boolean = true;

  // @Output
  @Output() close = new EventEmitter<any>();
  @Output() prevImage = new EventEmitter<any>();
  @Output() nextImage = new EventEmitter<any>();

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.transitionEffect = 'none';
    this.setPopupSliderWidth();
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event && event.key && this.arrowKeyMove) {
      if (event.key.toLowerCase() === 'arrowright') {
        this.nextImageLightbox();
      }

      if (event.key.toLowerCase() === 'arrowleft') {
        this.prevImageLightbox();
      }

      if (event.key.toLowerCase() === 'escape') {
        this.closeLightbox();
      }
    }
  }

  constructor(private elRef: ElementRef, @Inject(DOCUMENT) private document: any) {}

  setPopupSliderWidth() {
    if (window && window.innerWidth) {
      this.popupWidth = window.innerWidth;
      this.totalImages = this.images.length;

      this.marginLeft = -1 * this.popupWidth * this.currentImageIndex;
      this.getImageData();
      this.disableNavigation(0.2); // FIXME: do not use fixed timeout value
      setTimeout(() => {
        this.showLoading = false;
      }, 200);
    }
  }

  closeLightbox() {
    this.close.emit();
  }

  prevImageLightbox() {
    this.transitionEffect = `all ${this.speed}s ease-in-out`;
    if (this.currentImageIndex > 0 && !this.lightboxPrevDisable) {
      this.currentImageIndex--;
      this.prevImage.emit(LIGHTBOX_PREV_ARROW_CLICK_MESSAGE);
      this.marginLeft = -1 * this.popupWidth * this.currentImageIndex;
      this.getImageData();
      this.disableNavigation(this.speed);
    }
  }

  nextImageLightbox() {
    this.transitionEffect = `all ${this.speed}s ease-in-out`;
    if (this.currentImageIndex < this.images.length - 1 && !this.lightboxNextDisable) {
      this.currentImageIndex++;
      this.nextImage.emit(LIGHTBOX_NEXT_ARROW_CLICK_MESSAGE);
      this.marginLeft = -1 * this.popupWidth * this.currentImageIndex;
      this.getImageData();
      this.disableNavigation(this.speed);
    }
  }

  disableNavigation(seconds?: number) {
    this.lightboxNextDisable = true;
    this.lightboxPrevDisable = true;
    if (seconds) {
      setTimeout(() => {
        this.manageNavigationButtons();
      }, seconds * 1000);
    }
  }

  manageNavigationButtons() {
    this.lightboxNextDisable = false;
    this.lightboxPrevDisable = false;
    if (this.currentImageIndex >= this.images.length - 1) {
      this.lightboxNextDisable = true;
    }
    if (this.currentImageIndex <= 0) {
      this.lightboxPrevDisable = true;
    }
  }

  getImageData() {
    if (
      this.images?.length &&
      this.images[this.currentImageIndex] &&
      this.images[this.currentImageIndex]['image']
    ) {
      this.title = this.images[this.currentImageIndex]['title'] ?? '';
      this.totalImages = this.images.length;
    }
  }
}
