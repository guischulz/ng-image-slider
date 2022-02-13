import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Image } from './model/image.model';

const MAX_TRANSITION_DURATION = 2;

@Directive()
export abstract class SliderBaseComponent implements OnChanges {
  @Input() images: Image[] = [];

  totalImages: number = 0;
  selectedIndex: number = null;

  transitionEffect: string = 'none';
  @Input() transitionDuration: number = 0;

  buttonPrevDisabled: boolean = false;
  buttonNextDisabled: boolean = false;

  elementWidth: number = 0;
  marginLeft: number = 0;

  @Input()
  set selectedImage(index: number) {
    if (index && index > -1 && index < this.images.length) {
      this.selectedIndex = index;
    }
  }
  @Output() selectedImageChange = new EventEmitter<number>();

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.transitionEffect = 'none';
    this.updateSliderWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    const durationChange = changes['transitionDuration'];
    if (durationChange?.previousValue !== durationChange?.currentValue) {
      this.updateTransitionDuration(durationChange?.currentValue ?? 0);
    }

    const imageChange = changes['images'];
    if (imageChange?.previousValue !== imageChange?.currentValue) {
      this.updateImages(imageChange.currentValue as Image[]);
    }
  }

  getTransitionEffect() {
    if (!this.transitionDuration) {
      return 'none';
    } else {
      const duration = this.transitionDuration;
      const easing = 'ease-in-out';
      return `all ${duration}s ${easing}`;
    }
  }

  updateTransitionDuration(duration: number) {
    const transitionDuration = Math.max(0, Math.min(duration, MAX_TRANSITION_DURATION));
    if (transitionDuration !== this.transitionDuration) {
      this.transitionDuration = transitionDuration;
    }
    const transitionEffect = this.getTransitionEffect();
    if(transitionEffect !== this.transitionEffect) {
      this.transitionEffect = this.getTransitionEffect();
    }
  }

  updateImages(images: Image[]) {
    this.totalImages = images.length;
  }

  setActiveImage(index: number, btn = true) {
    if (index !== this.selectedIndex) {
      this.selectedIndex = index;
      this.selectedImageChange.emit(index);
      if (btn) {
        this.manageNavigationButtons();
      }
    }
  }

  updateSliderWidth() {
    this.elementWidth = window.innerWidth;
    this.marginLeft = this.calculateMarginLeft(this.selectedIndex);
  }

  prevImage(stepSize = 1) {
    if (this.selectedIndex > 0 && !this.buttonPrevDisabled) {
      this.gotoImage(this.selectedIndex - stepSize);
    }
  }

  nextImage(stepSize = 1) {
    if (this.selectedIndex < this.images.length - 1 && !this.buttonNextDisabled) {
      this.gotoImage(this.selectedIndex + stepSize);
    }
  }

  gotoImage(index: number) {
    const targetIndex = Math.max(Math.min(index, this.totalImages - 1), 0);
    const leftShift = this.calculateMarginLeft(targetIndex);

    this.setActiveImage(targetIndex, leftShift === this.marginLeft);

    if (leftShift !== this.marginLeft) {
      this.disableNavigation(this.transitionDuration);
      this.transitionEffect = this.getTransitionEffect();
      this.marginLeft = leftShift;
    }
  }

  calculateMarginLeft(targetIndex: number) {
    return -1 * this.elementWidth * targetIndex;
  }

  disableNavigation(seconds: number) {
    if (seconds) {
      this.buttonNextDisabled = true;
      this.buttonPrevDisabled = true;
      setTimeout(() => {
        this.manageNavigationButtons();
      }, seconds * 1000);
    } else {
      this.manageNavigationButtons();
    }
  }

  manageNavigationButtons() {
    this.buttonNextDisabled = false;
    this.buttonPrevDisabled = false;

    if (this.selectedIndex === this.totalImages - 1) {
      this.buttonNextDisabled = true;
    }
    if (this.selectedIndex === 0) {
      this.buttonPrevDisabled = true;
    }
  }
}
