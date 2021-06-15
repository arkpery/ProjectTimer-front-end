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
import { TimerComponent } from './timer/timer.component';

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
    TimerComponent
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
    NgbModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
