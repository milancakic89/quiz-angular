import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { PlayRoutingmodule } from './play-routing.module';



@NgModule({
  declarations: [
    PlayComponent
  ],
  imports: [
    CommonModule,
    PlayRoutingmodule
  ]
})
export class PlayModule { }
