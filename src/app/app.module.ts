import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsComponent } from './projects/projects.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { ProjectComponent } from './project/project.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from './ui-button/ui-button.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { TimelineComponent } from './timeline/timeline.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResponseResetPasswordComponent } from './pages/response-reset-password/response-reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { TeamsListComponent } from './pages/teams-list/teams-list.component';
import { TeamViewComponent } from './pages/team-view/team-view.component';
import { UserService } from './user.service';
import { TeamService } from './team/team.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { BadgeComponent } from './badge/badge.component';
import { TeamsComponent } from './teams/teams.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    UiNavbarComponent,
    ProjectComponent,
    UiButtonComponent,
    ProjectListComponent,
    TimelineComponent,
    RibbonComponent,
    ResetPasswordComponent,
    ResponseResetPasswordComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    TeamsListComponent,
    TeamViewComponent,
    BadgeComponent,
    TeamsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    TeamService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
