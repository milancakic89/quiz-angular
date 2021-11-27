import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxItemComponent } from './box-item/box-item.component';



@NgModule({
  declarations: [
    BoxItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [BoxItemComponent]
})
export class SharedModule { }
