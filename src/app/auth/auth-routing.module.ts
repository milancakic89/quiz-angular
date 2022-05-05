import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ResetComponent } from "./reset/reset.component";

const routes: Route[] = [
    {path: '', component: LoginComponent, data: {showNavigation: false}},
    {path: 'register', component: RegisterComponent, data: {showNavigation: false}},
    {path: 'reset', component: ResetComponent, data: {showNavigation: false}},
    { path: 'reset-password', component: ResetPasswordComponent, data: { showNavigation: false } },
    
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule{}