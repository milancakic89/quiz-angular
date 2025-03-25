import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { PlayComponent } from './play/play.component';
import { FrindsComponent } from './frinds/frinds.component';
import { FrindRequestsComponent } from './frind-requests/frind-requests.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ShopComponent } from './shop/shop.component';
import { MyQuestionsComponent } from './my-questions/my-questions.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: PlayComponent
            },
            {
                path: 'friends',
                component: FrindsComponent
            }
            ,
            {
                path: 'friend-requests',
                component: FrindRequestsComponent
            },
            {
                path: 'leaderboard',
                component: LeaderboardComponent
            },
            {
                path: 'shop',
                component: ShopComponent
            },
            {
                path: 'my-questions',
                component: MyQuestionsComponent
            },
            {
                path: 'add-question',
                component: AddQuestionComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        component: LoginComponent,
        canActivate: [AuthenticatedGuard],
    },

    {
        path: "*",
        redirectTo: ''
    }


];
