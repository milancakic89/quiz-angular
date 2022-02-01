import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxItemComponent } from './box-item/box-item.component';
import { OverscreenDirective } from './directives/overscreen.directive';



@NgModule({
  declarations: [
    BoxItemComponent,
    OverscreenDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [BoxItemComponent]
})
export class SharedModule { }
