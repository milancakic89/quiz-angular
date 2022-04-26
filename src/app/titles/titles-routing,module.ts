import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { TitlesComponent } from "./titles.component";

const routes: Route[] = [
    {path: '', component: TitlesComponent, data: {showNavigation: true}}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TitlesRoutingModule {}