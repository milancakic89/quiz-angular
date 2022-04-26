import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverscreenDirective } from './directives/overscreen.directive';
import { BoxItemComponent } from './components/box-item/box-item.component';
import { UserComponent } from './components/user/user.component';
import { PlayComponent } from './components/play/play.component';




@NgModule({
  declarations: [
    BoxItemComponent,
    OverscreenDirective,
    UserComponent,
    PlayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [BoxItemComponent, UserComponent, PlayComponent]
})
export class SharedModule { }
