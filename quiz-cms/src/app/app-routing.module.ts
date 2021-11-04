import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './shared/guards/authorization.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule)},
  { path: 'questions', loadChildren: () => import('./questions/questions.module').then(module => module.QuestionsModule)},
  { path: 'contribute', loadChildren: () => import('./contribute/contribute.module').then(module => module.ContributeModule)},
  { path: 'play', loadChildren: () => import('./play/play.module').then(module => module.PlayModule)},
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule)},
  { path: 'titles', loadChildren: () => import('./titles/titles.module').then(module => module.TitlesModule)},
  { path: 'ranking', loadChildren: () => import('./ranking/ranking.module').then(module => module.RankingModule)},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
