import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgImageSliderService } from './ng-image-slider.service';

const NEXT_ARROW_CLICK_MESSAGE = 'next';
const PREV_ARROW_CLICK_MESSAGE = 'previous';
const MAX_TRANSITION_DURATION = 2;

export interface Image {
  image: string;
  thumbImage: string;
  title?: string;
  order?: number | null;
  alt?: string;
}

export interface ImageSize {
  width?: number | string;
  height?: number | string;
  spacing?: number | string;
}

@Component({
  selector: 'ng-image-slider',
  templateUrl: './ng-image-slider.component.html',
  styleUrls: ['./ng-image-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgImageSliderComponent implements OnChanges, DoCheck, AfterViewInit, OnDestroy {
  // for slider
  sliderMainDivWidth: number = 0;
  imageParentDivWidth: number = 0;
  imageData: Image[] = [];
  lightboxImages: Image[] = [];
  totalImages: number = 0;
  leftPos: number = 0;
  transitionEffect: string = 'none';
  transitionDuration: number = 1; // default duration in seconds
  sliderPrevDisabled: boolean = false;
  sliderNextDisabled: boolean = false;
  stepSize: number = 1;
  sliderImageWidth: number;
  sliderImageHeight: number;
  showArrowButton: boolean = true;
  imageMargin: number = 0;
  sliderOrderType: string = 'ASC';

  // for lightbox
  lightboxShow: boolean = false;
  activeImageIndex: number;
  visibleImageIndex: number = 0;

  @ViewChild('sliderMain') sliderMain: ElementRef;
  @ViewChild('imageDiv') imageDiv: ElementRef;

  // @inputs
  @Input()
  set imageSize(data: ImageSize) {
    const margin = data?.spacing ?? '';
    if (margin !== '') {
      this.imageMargin = Number(margin);
    }
    const w = this.parseCssUnitString(data?.width, this.sliderImageWidth);
    const h = this.parseCssUnitString(data?.height, this.sliderImageHeight);
    this.updateThumbnailSize(w, h);
  }
  @Input() imagePopup: boolean = true;
  @Input()
  set slideDuration(duration: number) {
    if (duration && duration <= MAX_TRANSITION_DURATION) {
      this.transitionDuration = duration;
      this.transitionEffect = this.getTransitionEffect();
    }
  }
  @Input() images: Array<object> = [];
  @Input() set slideStepSize(val: number) {
    if (val) {
      this.stepSize = Math.round(val);
    }
  }
  @Input() set showArrow(flag: boolean) {
    this.showArrowButton = flag === true;
  }
  @Input() set orderType(data: string) {
    if (data) {
      this.sliderOrderType = data.toUpperCase();
    }
  }
  @Input() paginationShow: boolean = false;
  @Input() arrowKeyMove: boolean = true;
  @Input() manageImageRatio: boolean = false;
  @Input() set defaultActiveImage(activeIndex: number) {
    if (activeIndex) {
      this.activeImageIndex = activeIndex;
    }
  }
  @Input() lazyLoading: boolean = false;

  // @Outputs
  @Output() imageClick = new EventEmitter<number>();
  @Output() arrowClick = new EventEmitter<object>();
  @Output() lightboxArrowClick = new EventEmitter<object>();
  @Output() lightboxClose = new EventEmitter<object>();

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.updateSliderWidth();
  }

  constructor(public imageSliderService: NgImageSliderService, private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.updateSliderWidth();
  }

  ngOnDestroy() {
    if (this.lightboxShow === true) {
      this.close();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const imageChange = changes['images'];
    if (imageChange?.previousValue !== imageChange?.currentValue) {
      const images: Image[] = imageChange.currentValue as Image[];
      this.setSliderImages(images);
    }

    const imageSizeChange = changes['imageSize'];
    if (imageSizeChange?.previousValue !== imageSizeChange?.currentValue) {
      const size: ImageSize = imageSizeChange.currentValue as ImageSize;
      const w = this.parseCssUnitString(size.width, this.sliderImageWidth);
      const h = this.parseCssUnitString(size.height, this.sliderImageHeight);
      if (w || h) {
        this.updateThumbnailSize(w, h);
      }
    }
  }

  ngDoCheck() {
    if (this.images && this.lightboxImages && this.images.length !== this.lightboxImages.length) {
      this.setSliderImages(this.images);
    }
  }

  private getTransitionEffect() {
    const duration = this.transitionDuration ?? 0;
    const easing = duration >= 0.3 ? 'ease-in-out' : 'linear';
    return `all ${duration}s ${easing}`;
  }

  private parseCssUnitString(size: number | string, base?: number) {
    if (typeof size === 'number') {
      return size;
    }
    const cssSize = size as string;
    if (cssSize.indexOf('px') > 0) {
      return parseFloat(cssSize);
    }
    if (base && cssSize.indexOf('%') > 0) {
      return (base * parseFloat(cssSize)) / 100;
    }
    return Number(size);
  }

  setSliderImages(imgObj) {
    if (imgObj && imgObj instanceof Array && imgObj.length) {
      const sliderOrderEnable = imgObj.find((img) => {
        if (img.hasOwnProperty('order')) {
          return true;
        }
      });

      if (sliderOrderEnable) {
        imgObj = this.imageSliderService.orderArray(imgObj, this.sliderOrderType.toUpperCase());
      }

      this.imageData = imgObj.map((img, index) => {
        img['index'] = index;
        return img;
      });
      this.lightboxImages = [...this.imageData];
      this.totalImages = this.imageData.length;
    }
  }

  updateSliderWidth() {
    const offsetWidth = this.sliderMain?.nativeElement?.offsetWidth;
    if (offsetWidth && this.sliderMainDivWidth !== offsetWidth) {
      this.sliderMainDivWidth = offsetWidth;
    }
  }

  updateThumbnailSize(width?: number, height?: number) {
    if (width && this.sliderImageWidth !== width) {
      this.sliderImageWidth = width;
    }
    if (height && this.sliderImageHeight !== height) {
      this.sliderImageHeight = height;
    }

    const imageElementWidth = this.sliderImageWidth + this.imageMargin * 2;
    this.imageParentDivWidth = this.imageData.length * imageElementWidth;

    // Go back to first image
    this.leftPos = 0;
    this.manageSliderNavigationButtons();
  }

  imageOnClick(index: number) {
    this.activeImageIndex = index;
    if (this.imagePopup) {
      this.showLightbox();
    }
    this.imageClick.emit(index);
  }

  prev() {
    if (!this.sliderPrevDisabled) {
      this.prevImg();

      this.disableSliderNavigation(PREV_ARROW_CLICK_MESSAGE, this.transitionDuration);
      this.refreshVisibleIndex();
    }
  }

  next() {
    if (!this.sliderNextDisabled) {
      this.nextImg();

      this.disableSliderNavigation(NEXT_ARROW_CLICK_MESSAGE, this.transitionDuration);
      this.refreshVisibleIndex();
    }
  }

  prevImg() {
    if (0 >= this.leftPos + this.getSliderShiftWidth()) {
      this.leftPos += this.getSliderShiftWidth();
    } else {
      this.leftPos = 0;
    }
  }

  nextImg() {
    if (
      this.imageParentDivWidth + this.leftPos - this.sliderMainDivWidth >
      this.getSliderShiftWidth()
    ) {
      this.leftPos -= this.getSliderShiftWidth();
    } else if (this.imageParentDivWidth + this.leftPos - this.sliderMainDivWidth > 0) {
      this.leftPos -= this.imageParentDivWidth + this.leftPos - this.sliderMainDivWidth;
    }
  }

  refreshVisibleIndex() {
    const currentIndex = Math.round(
      (Math.abs(this.leftPos) + this.sliderImageWidth) / this.sliderImageWidth
    );
    if (
      this.imageData[currentIndex - 1] &&
      this.imageData[currentIndex - 1]['index'] !== undefined
    ) {
      this.visibleImageIndex = this.imageData[currentIndex - 1]['index'];
    }
  }

  getSliderShiftWidth() {
    const imageElementWidth = this.sliderImageWidth + this.imageMargin * 2;
    return imageElementWidth * this.stepSize;
  }

  /**
   * Disable slider left/right arrow when image is moving
   */
  disableSliderNavigation(msg: string, seconds?: number) {
    this.sliderNextDisabled = true;
    this.sliderPrevDisabled = true;
    if (seconds) {
      setTimeout(() => {
        this.manageSliderNavigationButtons(msg);
      }, seconds * 1000);
    }
  }

  manageSliderNavigationButtons(msg?: string) {
    this.sliderNextDisabled = false;
    this.sliderPrevDisabled = false;

    if (this.imageParentDivWidth + this.leftPos <= this.sliderMainDivWidth) {
      this.sliderNextDisabled = true;
    }
    if (this.leftPos >= 0) {
      this.sliderPrevDisabled = true;
    }

    if (msg) {
      this.arrowClick.emit({
        action: msg,
        prevDisabled: this.sliderPrevDisabled,
        nextDisabled: this.sliderNextDisabled
      });
    }
  }

  // for lightbox
  showLightbox() {
    if (this.imageData.length) {
      this.lightboxShow = true;
      this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }
  }

  close() {
    this.lightboxShow = false;
    this.elementRef.nativeElement.ownerDocument.body.style.overflow = '';
    this.lightboxClose.emit();
  }

  lightboxArrowClickHandler(event: Event) {
    this.lightboxArrowClick.emit(event);
  }
}
