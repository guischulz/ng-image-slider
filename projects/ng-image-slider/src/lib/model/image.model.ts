export interface Image {
  image: string;
  thumbImage?: string;
  title?: string;
  alt?: string;
  index?: number;
  show?: boolean;
  showThumb?: boolean;
}

export interface ImageSize {
  width?: number | string;
  height?: number | string;
  spacing?: number | string;
}
