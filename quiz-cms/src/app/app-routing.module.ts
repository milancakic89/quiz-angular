import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './shared/guards/authorization.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
    canActivate: [AuthorizationGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
