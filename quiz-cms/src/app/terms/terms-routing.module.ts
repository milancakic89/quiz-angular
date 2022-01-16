import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { PolicyComponent } from "./policy/policy.component";
import { TermsComponent } from "./terms/terms.component";

const routes: Route [] = [
    { path: 'privacy', component: PolicyComponent},
    { path: 'terms', component: TermsComponent },
    { path: '', redirectTo: 'privacy' }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TermsRoutingModule {}