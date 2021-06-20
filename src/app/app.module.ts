import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsComponent } from './controllers/projects/projects.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { ProjectComponent } from './controllers/project/project.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from './ui-button/ui-button.component';
import { ProjectListComponent } from './controllers/project-list/project-list.component';
import { TimelineComponent } from './controllers/timeline/timeline.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { TimerComponent } from './controllers/timer/timer.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResponseResetPasswordComponent } from './pages/response-reset-password/response-reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { TeamsListComponent } from './controllers/teams-list/teams-list.component';
import { TeamViewComponent } from './controllers/team-view/team-view.component';
import { TeamService } from './services/teams/team.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { BadgeComponent } from './badge/badge.component';
import { TeamsComponent } from './controllers/teams/teams.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartService } from './services/services.utils/bar/bar-chart-service.service';
import { PieChartService } from './services/services.utils/pie/pie-chart-service.service';
import { TimelineService } from './services/services.utils/timeline/timeline-service.service';
import { ProjectService } from './services/projects/project.service';
import { TimerrsService } from './services/timers/timerrs.service';
import { UsersTimersComponent } from './controllers/users-timers/users-timers.component';
import { UserService } from './services/users/user.service';
import { NgxSpinnerModule } from 'ngx-spinner';

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
    TimerComponent,
    ResetPasswordComponent,
    ResponseResetPasswordComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    TeamsListComponent,
    TeamViewComponent,
    BadgeComponent,
    TeamsComponent,
    BarChartComponent,
    PieChartComponent,
    UsersTimersComponent
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
    ReactiveFormsModule,
    ChartsModule,
    NgxSpinnerModule
  ],
  
  providers: [
    UserService,
    TeamService,
    AuthGuardService,
    BarChartService,
    PieChartService,
    TimelineService,
    ProjectService,
    TimerrsService,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
