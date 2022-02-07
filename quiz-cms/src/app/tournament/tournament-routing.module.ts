import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PlayComponent } from "./play/play.component";
import { RoomComponent } from "./room/room.component";
import { WaitingOthersComponent } from "./waiting-others/waiting-others.component";

const routes: Route[] = [
    { path: '', component: DashboardComponent},
    { path: 'room/:id/results', component: WaitingOthersComponent },
    { path: 'room/:id/play', component: PlayComponent },
    { path: 'room/:id', component: RoomComponent}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TournamentRoutingModule{}