import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AchievementsComponent } from "./achievements.component";

const routes: Route[] = [
    {path: '', component: AchievementsComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AchievementsRoutingModule{}