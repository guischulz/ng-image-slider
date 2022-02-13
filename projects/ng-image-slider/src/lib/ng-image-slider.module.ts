import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgImageSliderComponent } from './ng-image-slider.component';
import { NgImageSliderService } from './ng-image-slider.service';
import { SliderCustomImageComponent } from './slider-custom-image/slider-custom-image.component';
import { SliderLightboxComponent } from './slider-lightbox/slider-lightbox.component';
import { ChevronIconComponent } from './icons/chevron/chevron-icon.component';
import { SwipeDirective } from './directives/swipe.directive';
import { DeferLoadDirective } from './directives/defer-load.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgImageSliderComponent,
        SliderCustomImageComponent,
        SliderLightboxComponent,
		ChevronIconComponent,
		SwipeDirective,
		DeferLoadDirective,
    ],
    providers: [
        NgImageSliderService
    ],
    exports: [NgImageSliderComponent, SwipeDirective]
})
export class NgImageSliderModule { }
