import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { PlayGuard } from './shared/guards/play-guard';

const routes: Routes = [
  { path: '', 
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)},

  { path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
    canActivate: [AuthorizationGuard]},
 
  { path: 'questions', 
    loadChildren: () => import('./questions/questions.module').then(module => module.QuestionsModule),
    canActivate: [AuthorizationGuard]},
  
  { path: 'contribute', 
    loadChildren: () => import('./contribute/contribute.module').then(module => module.ContributeModule),
    canActivate: [AuthorizationGuard]},
  
  { path: 'play', 
    loadChildren: () => import('./play/play.module').then(module => module.PlayModule),
    canActivate: [AuthorizationGuard],
    canDeactivate: [PlayGuard]},
    
  
  { path: 'profile', 
    loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule),
    canActivate: [AuthorizationGuard]},
  
  { path: 'titles', 
    loadChildren: () => import('./titles/titles.module').then(module => module.TitlesModule),
    canActivate: [AuthorizationGuard, AdminGuard]},
  
  { path: 'ranking', 
    loadChildren: () => import('./ranking/ranking.module').then(module => module.RankingModule),
    canActivate: [AuthorizationGuard]},

  { path: 'achievements', 
    loadChildren: () => import('./achievements/achievements.module').then(module => module.AchievementsModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'privacy-and-terms',
    loadChildren: () => import('./terms/terms.module').then(module => module.TermsModule)
  },
  
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
