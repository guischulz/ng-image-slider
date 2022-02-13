import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { HeroService, Image } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('nav') nav: NgImageSliderComponent;
  @ViewChild('pic') pic: NgImageSliderComponent;
  title = 'Ng Image Slider';

  sliderWidth: Number = 950;
  sliderImageWidth: Number = 180;
  sliderImageHeight: Number = 120;
  sliderArrowShow: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Boolean = false;
  sliderImageStepSize: Number = 1;
  sliderTransitionDuration: any = 0.3;
  imageObject: Image[];
  imageIndex = 5;

  constructor(private heroService: HeroService) {
    this.setImageObject();
  }

  onChangeHandler() {
    this.setImageObject();
    this.nav.updateSliderWidth();
  }

  setImageObject() {
    this.imageObject = [...this.heroService.getImages()];
  }

  imageOnClick(index: number) {
    console.log('index', index);
  }

  lightboxClose() {
    console.log('lightbox close');
  }

  arrowOnClick(event: string) {
    console.log('arrow click event', event);
  }

  lightboxArrowClick(event: Event) {
    console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.nav.prevImage();
  }

  nextImageClick() {
    this.nav.nextImage();
  }
}
