import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { FormComponent } from "./form/form.component";

const routes: Route[] = [
    {path: '', component: FormComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {}