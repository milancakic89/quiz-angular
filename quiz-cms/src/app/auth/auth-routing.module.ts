import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetComponent } from "./reset/reset.component";

const routes: Route[] = [
    {path: '', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'reset', component: ResetComponent},
    
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule{}