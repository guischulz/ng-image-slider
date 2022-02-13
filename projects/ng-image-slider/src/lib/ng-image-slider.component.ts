import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Image, ImageSize } from './model/image.model';
import { SliderBaseComponent } from './slider-base.component';

const NEXT_ARROW_CLICK_MESSAGE = 'next';
const PREV_ARROW_CLICK_MESSAGE = 'previous';

@Component({
  selector: 'ng-image-slider',
  templateUrl: './ng-image-slider.component.html',
  styleUrls: ['./ng-image-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgImageSliderComponent
  extends SliderBaseComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  // for slider
  imageWidth: number;
  imageHeight: number;
  imageMargin: number = 0;

  imageParentDivWidth: number = 0;
  showArrowButtons: boolean = true;
  stepSize: number = 1;

  // for lightbox
  isLightboxActive: boolean = false;

  @ViewChild('sliderMain') sliderMain: ElementRef;
  @ViewChild('imageDiv') imageDiv: ElementRef;

  // @Inputs
  @Input()
  set imageSize(data: ImageSize) {
    const margin = data?.spacing ?? '';
    if (margin !== '') {
      this.imageMargin = Number(margin);
    }
    const w = this.parseCssUnitString(data?.width, this.imageWidth);
    const h = this.parseCssUnitString(data?.height, this.imageHeight);
    this.updateThumbnailSize(w, h);
  }
  @Input() imagePopup: boolean = true;
  @Input() set slideStepSize(val: number) {
    if (val) {
      this.stepSize = Math.round(val);
    }
  }
  @Input() set showArrow(flag: boolean) {
    this.showArrowButtons = flag === true;
  }
  @Input() showPagination: boolean = false;
  @Input() manageImageRatio: boolean = false;
  @Input() set selectedImage(index: number) {
    if (index >= 0 && index < this.totalImages) {
      this.gotoImage(index);
    } else if (this.selectedIndex === null) {
      // initial starting position
      this.marginLeft = this.calculateMarginLeft(index);
      this.selectedIndex = index;
    }
  }
  
  // @Outputs
  @Output() arrowClick = new EventEmitter<string>();
  @Output() lightboxClose = new EventEmitter<object>();

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngAfterViewInit() {
    this.updateSliderWidth();
  }

  ngOnDestroy() {
    if (this.isLightboxActive === true) {
      this.closeLightbox();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    const imageSizeChange = changes['imageSize'];
    if (imageSizeChange?.previousValue !== imageSizeChange?.currentValue) {
      const size: ImageSize = imageSizeChange.currentValue as ImageSize;
      const w = this.parseCssUnitString(size.width, this.imageWidth);
      const h = this.parseCssUnitString(size.height, this.imageHeight);
      if (w || h) {
        this.updateThumbnailSize(w, h);
      }
    }
  }

  get selectedImage() {
    return this.selectedIndex;
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

  private get maxPosition() {
    return this.totalImages * (this.imageWidth + this.imageMargin * 2) - this.elementWidth;
  }

  private get currentPosition() {
    return this.marginLeft * -1;
  }

  updateThumbnailSize(width?: number, height?: number) {
    if (width && this.imageWidth !== width) {
      this.imageWidth = width;
    }
    if (height && this.imageHeight !== height) {
      this.imageHeight = height;
    }

    const imageElementWidth = this.imageWidth + this.imageMargin * 2;
    this.imageParentDivWidth = this.totalImages * imageElementWidth;
  }

  updateImages(images: Image[]) {
    super.updateImages(images);

    this.images = images.map((image, index) => {
      image.index = index;
      image.show = image.show ?? false;
      return image;
    });
  }

  updateSliderWidth() {
    const offsetWidth = this.sliderMain?.nativeElement?.offsetWidth;
    if (offsetWidth && this.elementWidth !== offsetWidth) {
      this.elementWidth = offsetWidth;
    }
  }

  prevImage() {
    if (!this.buttonPrevDisabled) {
      this.arrowClick.emit(PREV_ARROW_CLICK_MESSAGE);
      super.prevImage(this.stepSize);
    }
  }

  nextImage() {
    if (!this.buttonNextDisabled) {
      this.arrowClick.emit(NEXT_ARROW_CLICK_MESSAGE);
      super.nextImage(this.stepSize);
    }
  }

  calculateMarginLeft(targetIndex: number) {
    const currentIndex = this.selectedIndex ?? 0;
    const maxPosition = this.maxPosition > 0 ? this.maxPosition : Number.MAX_SAFE_INTEGER;
    const offset = (this.imageWidth + this.imageMargin * 2) * (targetIndex - currentIndex);

    return targetIndex === 0
      ? 0
      : -1 * Math.min(Math.max(0, this.currentPosition + offset), maxPosition);
  }

  onImageClick(index: number) {
    this.setActiveImage(index);

    if (this.imagePopup) {
      this.openLightbox();
    }
  }

  // for lightbox
  openLightbox() {
    if (this.totalImages) {
      this.isLightboxActive = true;
      this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.isLightboxActive = false;
    this.elementRef.nativeElement.ownerDocument.body.style.overflow = '';
    this.lightboxClose.emit();
  }
}
