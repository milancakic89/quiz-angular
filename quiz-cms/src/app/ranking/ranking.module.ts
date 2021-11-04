import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingRoutingModule } from './ranking-routing.module';



@NgModule({
  declarations: [
    RankingComponent
  ],
  imports: [
    CommonModule,
    RankingRoutingModule
  ]
})
export class RankingModule { }
