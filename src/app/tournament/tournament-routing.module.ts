import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { PlayGuard } from "../shared/guards/play-guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OneOnOneComponent } from "./one-on-one/one-on-one.component";
import { PlayComponent } from "./play/play.component";
import { RoomMonitoringComponent } from "./room-monitoring/room-monitoring.component";
import { RoomComponent } from "./room/room.component";
import { WaitingOthersComponent } from "./waiting-others/waiting-others.component";

const routes: Route[] = [
    { path: '', component: DashboardComponent, data: {showNavigation: true}},
    { path: 'one-on-one', component: OneOnOneComponent, data: {showNavigation: false}},
    { path: 'monitoring', component: RoomMonitoringComponent, data: {showNavigation: true} },
    { path: 'room/:id/results', component: WaitingOthersComponent, canDeactivate: [PlayGuard], data: {showNavigation: false} },
    { path: 'room/:id/play', component: PlayComponent, canDeactivate: [PlayGuard], data: {showNavigation: false} },
    { path: 'room/:id', component: RoomComponent, data: {showNavigation: true}}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TournamentRoutingModule{}