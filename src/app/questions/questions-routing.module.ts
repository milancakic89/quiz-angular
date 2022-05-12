import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { QuestionItemComponent } from "./question-item/question-item.component";
import { QuestionsComponent } from "./questions.component";

const routes: Route[] = [
    { path: '', component: QuestionsComponent, data: {showNavigation: true}},
    { path: ':id', component: QuestionItemComponent, data: { showNavigation: true } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionsRoutingModule{}