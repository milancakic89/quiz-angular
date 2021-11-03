import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { PlayComponent } from "./play.component";

const routes: Route[] = [
    {path: '', component: PlayComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayRoutingmodule{}