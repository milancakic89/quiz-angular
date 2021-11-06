import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { PlayRoutingmodule } from './play-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PlayComponent
  ],
  imports: [
    CommonModule,
    PlayRoutingmodule,
    FormsModule
  ]
})
export class PlayModule { }
