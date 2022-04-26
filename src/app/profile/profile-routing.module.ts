import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";

const routes: Route[] = [
    {path: '', component: ProfileComponent, data: {showNavigation: true}}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule{}