import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgImageSliderService } from './../ng-image-slider.service';

const validFileExtensions = ['jpeg', 'jpg', 'gif', 'png'];

@Component({
  selector: 'custom-img',
  templateUrl: './slider-custom-image.component.html'
})
export class SliderCustomImageComponent implements OnChanges {
  IMAGE = 'image';
  fileUrl: SafeResourceUrl = '';
  fileExtension = '';
  type = this.IMAGE;
  imageLoading: boolean = true;

  // @inputs
  @Input() imageUrl: string;

  constructor(public imageSliderService: NgImageSliderService, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['imageUrl'];
    if (change && change.firstChange && this.imageUrl === change.currentValue) {
      this.setUrl(this.imageUrl);
    }
  }

  setUrl(url: string) {
    this.imageLoading = true;
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.fileExtension = url.split('.').pop().split(/\#|\?/)[0];
    const base64Ext = this.imageSliderService.base64FileExtension(url);
    if (base64Ext && validFileExtensions.indexOf(base64Ext.toLowerCase()) > -1) {
      this.fileExtension = base64Ext;
    }
    if (this.fileExtension && validFileExtensions.indexOf(this.fileExtension.toLowerCase()) > -1) {
      this.type = this.IMAGE;
    }
  }
}
