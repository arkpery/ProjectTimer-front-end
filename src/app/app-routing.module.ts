import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './controllers/project/project.component';
import { ProjectsComponent } from './controllers/projects/projects.component';
import { TimerComponent } from './controllers/timer/timer.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResponseResetPasswordComponent } from './pages/response-reset-password/response-reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TeamsComponent } from './controllers/teams/teams.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { TeamViewComponent } from './controllers/team-view/team-view.component';
import { UsersTimersComponent } from './controllers/users-timers/users-timers.component';
import { ProfilViewComponent } from './pages/profil-view/profil-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: "projects/:id", component: ProjectComponent },
  { path: "users/timers", component: UsersTimersComponent },
  { path: 'request-reset-password', component: ResetPasswordComponent },
  { path: 'response-reset-password/:token', component: ResponseResetPasswordComponent },
  { path: 'teams', canActivate: [AuthGuardService], component: TeamsComponent },
  { path: 'teams/:id', canActivate: [AuthGuardService], component: TeamViewComponent },
  { path: 'my-profil', canActivate: [AuthGuardService], component: ProfilViewComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
