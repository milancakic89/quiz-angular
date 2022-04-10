import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";

const routes: Route[] = [
    { path: '', component: ListComponent, data: {showNavigation: true}},
    { path: ':query', component: ListComponent, data: {showNavigation: true} }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FriendsRoutingModule{}