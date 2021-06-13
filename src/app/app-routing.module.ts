import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';
import { TimerComponent } from './timer/timer.component';


const routes: Routes = [
  {path: 'projects', component: ProjectsComponent},
  {path: "projects/:id", component: ProjectComponent},
  {path: 'my-timers/:id', component: TimerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
