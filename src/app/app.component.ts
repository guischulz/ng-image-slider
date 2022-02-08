import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { HeroService, Image } from "./hero.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild('nav') ds: NgImageSliderComponent;
    title = 'Ng Image Slider';

    sliderWidth: Number = 969;
    sliderImageWidth: Number = 240;
    sliderImageHeight: Number = 157;
    sliderArrowShow: Boolean = true;
    sliderImagePopup: Boolean = true;
    sliderAutoSlide: Boolean = false;
    sliderSlideImage: Number = 1;
    sliderAnimationSpeed: any = 0.3;
    imageObject: Image[];
    slideOrderType:string = 'DESC';

    constructor(private heroService: HeroService) {
        this.setImageObject();
    }

    onChangeHandler() {
        this.setImageObject();
    }

    setImageObject() {
        this.imageObject = [...this.heroService.getImagesWithOrder()];
    }

    imageOnClick(index: number) {
        console.log('index', index);
    }

    lightboxClose() {
        console.log('lightbox close')
    }

    arrowOnClick(event: Event) {
        console.log('arrow click event', event);
    }

    lightboxArrowClick(event: Event) {
        console.log('popup arrow click', event);
    }

    prevImageClick() {
        this.ds.prev();
    }

    nextImageClick() {
        this.ds.next();
    }
}
