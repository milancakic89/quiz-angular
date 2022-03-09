import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { PlayGuard } from "../shared/guards/play-guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OneOnOneComponent } from "./one-on-one/one-on-one.component";
import { PlayComponent } from "./play/play.component";
import { RoomComponent } from "./room/room.component";
import { WaitingOthersComponent } from "./waiting-others/waiting-others.component";

const routes: Route[] = [
    { path: '', component: DashboardComponent},
    { path: 'one-on-one', component: OneOnOneComponent },
    { path: 'room/:id/results', component: WaitingOthersComponent, canDeactivate: [PlayGuard] },
    { path: 'room/:id/play', component: PlayComponent, canDeactivate: [PlayGuard] },
    { path: 'room/:id', component: RoomComponent}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TournamentRoutingModule{}