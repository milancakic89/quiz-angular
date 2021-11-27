import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsComponent } from './achievements.component';
import { SharedModule } from '../shared/shared.module';
import { AchievementsRoutingModule } from './achievements-routing.module';



@NgModule({
  declarations: [
    AchievementsComponent
  ],
  imports: [
    CommonModule,
    AchievementsRoutingModule,
    SharedModule
  ]
})
export class AchievementsModule { }
