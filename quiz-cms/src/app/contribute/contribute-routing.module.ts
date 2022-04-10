import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ContributeComponent } from "./contribute.component";


const routes: Route[] = [
    {path: '', component: ContributeComponent, data: {showNavigation: true}}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContributeRoutingModule{}