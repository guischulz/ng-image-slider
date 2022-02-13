import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

const MAX_MOVE_TIME = 1000;
const MIN_MOVE_DISTANCE = 30;
const MIN_MOVE_TRIGGER = 5;

@Directive({ selector: '[swipe]' })
export class SwipeDirective {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  swipeCoord = [0, 0];
  swipeTime = 0;
  swipeStarted = false;
  swipeMoved = false;

  constructor() {}

  @HostListener('mousedown', ['$event'])
  onSwipeStart(event: MouseEvent) {
    this.onSwipe(event, 'start');
    this.swipeStarted = true;
    this.swipeMoved = false;
    event.preventDefault();
  }

  @HostListener('mouseup', ['$event'])
  onSwipeEnd(event: MouseEvent) {
    if (this.swipeMoved) {
      this.onSwipe(event, 'end');
      setTimeout(() => {
        this.swipeStarted = false;
        this.swipeMoved = false;
      });
    }
    event.preventDefault();
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent) {
    if (this.swipeStarted && Math.abs(event.movementX) >= MIN_MOVE_TRIGGER) {
      this.swipeMoved = true;
    }
    event.preventDefault();
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    if (this.swipeStarted && this.swipeMoved) {
      $event.stopPropagation();
    }
    this.swipeStarted = false;
  }

  onSwipe(e: MouseEvent, when: string): void {
    const coord: [number, number] = [e.clientX, e.clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (
        duration < MAX_MOVE_TIME &&
        Math.abs(direction[0]) > MIN_MOVE_DISTANCE &&
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        const swipeDir = direction[0] < 0 ? 'next' : 'previous';
        if (swipeDir === 'next') {
          this.next.emit();
        } else {
          this.previous.emit();
        }
      }
    }
  }
}
