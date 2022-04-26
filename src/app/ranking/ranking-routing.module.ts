import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { RankingComponent } from "./ranking.component";

const routes: Route[] = [
    {path: '', component: RankingComponent, data: {showNavigation: true}}
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RankingRoutingModule {}