import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitlesComponent } from './titles.component';
import { TitlesRoutingModule } from './titles-routing,module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TitlesComponent
  ],
  imports: [
    CommonModule,
    TitlesRoutingModule,
    FormsModule
  ]
})
export class TitlesModule { }
