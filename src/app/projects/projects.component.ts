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
  projects: Array<Project> = [];
  defaultGroupId: Array<string> = [];
  currentUser?: User;
  requestDone: boolean = false;

  constructor(private projectService: ProjectService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.CurrentUser();
      await this.onFetchProjects();
    }
    catch (e) {
      this.requestDone = true;
    }
  }

  status(project: Project) {
    return (project.close ? "Fermé" : "En cours");
  }

  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
    console.log("enter");
    console.log(this.currentUser);
  }

  async onFetchProjects() {
    this.projects = await this.projectService.findAll().toPromise();
    this.defaultGroupId = this.projects.map(project => this.defaultGroup(project.groups));
    this.requestDone = true;
  }

  async onDeleteProject(project: Project) {
    await this.projectService.deleteOne(project).toPromise();
    await this.onFetchProjects();
  }

  defaultGroup(groups: Array<Group>) {
    if (groups.length) {
      return (groups[0]._id);
    }
    return ("");
  }

}
