import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResponseResetPasswordComponent } from './pages/response-reset-password/response-reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TeamsListComponent } from './pages/teams-list/teams-list.component';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { TeamViewComponent } from './pages/team-view/team-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: "projects/:id", component: ProjectComponent },
  { path: 'request-reset-password', component: ResetPasswordComponent },
  { path: 'response-reset-password/:token', component: ResponseResetPasswordComponent },
  { path: 'teams', canActivate: [AuthGuardService], component: TeamsListComponent },
  { path: 'teams/:id', canActivate: [AuthGuardService], component: TeamViewComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }