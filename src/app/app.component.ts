import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { HeroService, Image } from "./hero.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    @ViewChild('nav') ds: NgImageSliderComponent;
    title = 'Ng Image Slider';

    sliderWidth: Number = 940;
    sliderImageWidth: Number = 250;
    sliderImageHeight: Number = 200;
    sliderArrowShow: Boolean = true;
    sliderInfinite: Boolean = false;
    sliderImagePopup: Boolean = true;
    sliderAutoSlide: Boolean = false;
    sliderSlideImage: Number = 1;
    sliderAnimationSpeed: any = 1;
    imageObject: Image[];
    slideOrderType:string = 'DESC';

    constructor(private heroService: HeroService) {
        this.setImageObject();
    }

    ngAfterViewInit(): void {
        this.setImageSize();
    }

    private setImageSize() {
        this.ds.imageSize = {
            'width'  : this.sliderImageWidth,
            'height' : this.sliderImageHeight
        }
        this.ds.setSliderWidth();
    }

    onChangeHandler() {
        this.setImageObject();
    }
    
    onChangeImageSize() {
        this.setImageSize();
    }

    onChangeInfinite() {
        if (!this.sliderInfinite && this.sliderAutoSlide) {
            this.sliderAutoSlide = false;
            this.ds.imageMouseEnterHandler()
        }
    }

    onChangeAutoSlide() {
        if (this.sliderAutoSlide) {
            setTimeout(() => {
                this.ds.imageAutoSlide();
            });
        } else {
            this.ds.imageMouseEnterHandler()
        }
    }

    setImageObject() {
        this.imageObject = this.heroService.getImagesWithOrder();
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
