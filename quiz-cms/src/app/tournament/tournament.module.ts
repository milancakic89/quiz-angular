import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentComponent } from './tournament.component';
import { TournamentRoutingModule } from './tournament-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import { PlayComponent } from './play/play.component';
import { WaitingOthersComponent } from './waiting-others/waiting-others.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    TournamentComponent,
    DashboardComponent,
    RoomComponent,
    PlayComponent,
    WaitingOthersComponent
  ],
  imports: [
    TournamentRoutingModule,
    FormsModule,
    SharedModule,
    CommonModule
  ]
})
export class TournamentModule { }
