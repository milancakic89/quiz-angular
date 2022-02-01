import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[overscreen]'
})
export class OverscreenDirective implements OnDestroy{
  public element: any;
  constructor(el: ElementRef) { 
    this.element = document.querySelector('.content');
    if (!this.element.classList.contains('.overscreen')) {
      this.element.classList.add('.overscreen')
    }
  }

  ngOnDestroy(): void {
    if (!this.element.classList.contains('.overscreen')) {
      this.element.classList.remove('.overscreen');
    }
  }

}
