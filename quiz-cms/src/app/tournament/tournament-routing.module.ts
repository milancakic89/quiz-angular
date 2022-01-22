import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RoomComponent } from "./room/room.component";

const routes: Route[] = [
    {path: '', component: DashboardComponent},
    {path: 'room/:id', component: RoomComponent}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TournamentRoutingModule{}