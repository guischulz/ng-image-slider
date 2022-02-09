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
  type = this.IMAGE;
  imageLoading: boolean = true;

  // @inputs
  @Input() imageUrl: string;
  @Input() alt: String = '';
  @Input() title: String = '';
  @Input() ratio: boolean = false;
  @Input() lazy: boolean = false;

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
    let fileExtension = url.split('.').pop().split(/\#|\?/)[0];
    const base64Ext = this.imageSliderService.base64FileExtension(url);
    if (base64Ext && validFileExtensions.indexOf(base64Ext.toLowerCase()) > -1) {
      fileExtension = base64Ext;
    }
    if (fileExtension && validFileExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      this.type = this.IMAGE;
    }
  }
}
