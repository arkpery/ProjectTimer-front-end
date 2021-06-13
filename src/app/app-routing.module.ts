import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResponseResetPasswordComponent } from './pages/response-reset-password/response-reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: "projects/:id", component: ProjectComponent },
  { path: 'request-reset-password', component: ResetPasswordComponent },
  { path: 'response-reset-password/:token', component: ResponseResetPasswordComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
