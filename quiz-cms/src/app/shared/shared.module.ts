import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxItemComponent } from './box-item/box-item.component';
import { OverscreenDirective } from './directives/overscreen.directive';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    BoxItemComponent,
    OverscreenDirective,
    UserComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [BoxItemComponent, UserComponent]
})
export class SharedModule { }
