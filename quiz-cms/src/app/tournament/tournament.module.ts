import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentComponent } from './tournament.component';
import { TournamentRoutingModule } from './tournament-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';



@NgModule({
  declarations: [
    TournamentComponent,
    DashboardComponent,
    RoomComponent
  ],
  imports: [
    TournamentRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class TournamentModule { }
