import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { PlayComponent } from './play/play.component';
import { FrindsComponent } from './friends/frinds.component';
import { FrindRequestsComponent } from './friend-requests/frind-requests.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ShopComponent } from './shop/shop.component';
import { MyQuestionsComponent } from './my-questions/my-questions.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './auth/register/register.component';
import { RoomComponent } from './room/room.component';
import { playingGuard } from './shared/guards/playing.guard';
import { GameplayComponent } from './gameplay/gameplay.component';
import { OneOnOneComponent } from './play/one-on-one/one-on-one.component';
import { ResetComponent } from './auth/reset/reset.component';
import { ActivateGuard } from './shared/guards/activate.guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: PlayComponent
            },
            {
                path: 'friends',
                component: FrindsComponent
            },
            {
                path: 'game',
                component: GameplayComponent,
                canDeactivate: [playingGuard]
            },
            {
                path: 'one-on-one',
                component: OneOnOneComponent,
                canDeactivate: []
            },
            {
                path: 'room/:room_id',
                component: RoomComponent,
            },
            {
                path: 'friend-requests',
                component: FrindRequestsComponent
            },
            {
                path: 'leaderboard',
                component: LeaderboardComponent
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
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'activate',
        component: ResetComponent,
        canActivate: [ActivateGuard],
    },
    {
        path: '**',
        component: LoginComponent,
        canActivate: [AuthenticatedGuard],
    },

];
