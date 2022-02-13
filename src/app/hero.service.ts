import { Injectable } from '@angular/core';

export interface Image {
  image: string;
  thumbImage: string;
  title?: string;
  alt?: string;
}

@Injectable()
export class HeroService {
  constructor() {}

  data: Image[] = [
    {
      image: 'https://picsum.photos/id/582/536/354',
      thumbImage: 'https://picsum.photos/id/582/395/240',
      title: 'Image One'
    },
    {
      image: 'https://picsum.photos/id/392/536/354',
      thumbImage: 'https://picsum.photos/id/392/395/240',
      alt: 'Image Two'
    },
    {
      image: 'https://picsum.photos/id/237/536/354',
      thumbImage: 'https://picsum.photos/id/237/395/240',
      alt: 'alt of image three',
      title: 'Image Three'
    },
    {
      image: 'https://picsum.photos/id/922/536/354',
      thumbImage: 'https://picsum.photos/id/922/395/240',
      title: 'Image Four'
    },
    {
      image: 'https://picsum.photos/id/168/889/536',
      thumbImage: 'https://picsum.photos/id/168/395/240',
      title: 'Image Five'
    },
    {
      image: 'https://picsum.photos/id/110/889/536',
      thumbImage: 'https://picsum.photos/id/110/395/240',
      title: 'Image Six'
    },
    {
      image: 'https://picsum.photos/id/916/889/536',
      thumbImage: 'https://picsum.photos/id/916/395/240',
      title: 'Image Seven'
    },
    {
      image: 'https://picsum.photos/id/851/889/536',
      thumbImage: 'https://picsum.photos/id/851/395/240',
      title: 'Image Eight'
    },
    {
      image: 'https://picsum.photos/id/305/889/536',
      thumbImage: 'https://picsum.photos/id/305/395/240',
      title: 'Image Nine'
    },
    {
      image: 'https://picsum.photos/id/584/889/536',
      thumbImage: 'https://picsum.photos/id/584/395/240',
      title: 'Image Ten'
    },
    {
      image: 'https://picsum.photos/id/919/889/536',
      thumbImage: 'https://picsum.photos/id/919/395/240',
      title: 'Image Eleven'
    },
    {
      image: 'https://picsum.photos/id/859/889/536',
      thumbImage: 'https://picsum.photos/id/859/395/240',
      title: 'Image Twelve'
    },
    {
      image: 'https://picsum.photos/id/719/889/536',
      thumbImage: 'https://picsum.photos/id/719/395/240',
      title: 'Image Thirteen'
    },
    {
      image: 'https://picsum.photos/id/242/889/536',
      thumbImage: 'https://picsum.photos/id/242/395/240',
      title: 'Image Fourteen'
    }
  ];

  getImages() {
    return this.data;
  }
}
