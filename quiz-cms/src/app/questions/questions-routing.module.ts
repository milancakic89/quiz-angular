import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { QuestionsComponent } from "./questions.component";

const routes: Route[] = [
    {path: '', component: QuestionsComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionsRoutingModule{}