import { Injectable } from '@angular/core';

@Injectable()
export class NgImageSliderService {

    constructor() { }

    base64FileExtension(str: string) {
        return str.substring("data:image/".length, str.indexOf(";base64"));
    }
}
