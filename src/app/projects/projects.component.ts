import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Project } from '../models/Project';
import { ProjectService } from '../project.service';
import { faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Group } from '../models/Group';
import { UserService } from '../user.service';
import { User } from '../models/User';
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  faTrash = faTrash;
  faCogs = faCogs;
  token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBjMThjNDJjNzcyYWEwNTQ2NDAyNjJmIiwiZW1haWwiOiJtYXhpbWVAbWFpbC5mciJ9LCJpYXQiOjE2MjMyOTcwOTAsImV4cCI6MTYyNTg4OTA5MH0.pElOdmwMGf9H2RUr1wxunCXSZLXhKhWg1e90gvZ6R1s";
  projects: Array<Project> = [];
  defaultGroupId: Array<string> = [];
  currentUser?: User;


  constructor(private projectService: ProjectService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    window.localStorage.setItem("token", this.token);

    await this.CurrentUser();
    await this.onFetchProjects();
  }

  status(project: Project){
    return (project.close ? "Fermé" : "En cours");
  }

  async CurrentUser(){
    this.currentUser = await this.userService.CurrentUser();
    console.log("enter");
    console.log(this.currentUser);
  }

  async onFetchProjects(){
    this.projects = await this.projectService.findAll().toPromise();
    this.defaultGroupId = this.projects.map(project => this.defaultGroup(project.groups));
  }

  async onDeleteProject(project: Project){
    await this.projectService.deleteOne(project).toPromise();
    await this.onFetchProjects();
  }

  defaultGroup(groups: Array<Group>){
    if (groups.length){
      return (groups[0]._id);
    }
    return ("");
  }

}
