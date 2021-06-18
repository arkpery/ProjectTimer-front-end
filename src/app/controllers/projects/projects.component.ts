import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Project } from '../../models/project/Project';
import { ProjectService } from '../../services/projects/project.service';
import { faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Group } from '../../models/team/Group';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user/User';
import { TimelineComponent } from '../timeline/timeline.component';
import { TeamService } from 'src/app/services/teams/team.service';
import { Team } from 'src/app/models/team/team.model';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  groupList: Array<Team> = [];
  selectedGroupId: Array<string> = [];
  createProjectForm!: FormGroup;
  selectForm!: FormGroup;

  constructor(private projectService: ProjectService, private userService: UserService, private groupService: TeamService,
    private fb: FormBuilder,
    private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.CurrentUser();
      await this.onFetchProjects();
      this.FetchTeam();
      this.selectForm = this.fb.group({
        groups: []
      });
      this.createProjectForm = this.fb.group({
        name: ['']
      });
    }
    catch (e) {
      this.requestDone = true;
    }
  }

  status(project: Project) {
    return (project.close ? "Fermé" : "En cours");
  }

  FetchTeam() {
    this.groupService.getAllGroup().subscribe((teams) => {
      this.groupList = teams.map((team) => {
        return ({
          search_label: team.name,
          _id: team._id
        });
      });
    });
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

  AddNewProject(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static'
    });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere: boolean[] = [];

    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      let search = item['search_label'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word: any) => this_word;
    return isWordThere.every(all_words);
  }

  clearListSelected() {
    this.selectForm.get('groups')?.patchValue([]);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.modalService.dismissAll();

    console.log(this.selectedGroupId);
    const formValue = this.createProjectForm.value;
    const newProject = {
      name: formValue['name'],
      groups: this.selectedGroupId,
      close: false
    } as Project;
    console.log(newProject)
    this.projectService.save(newProject).subscribe(
      async () => {
        Swal.fire('successfully created!', 'Project  created.', 'success')
        await this.onFetchProjects();
      },
      (error: any) => {
        Swal.fire('Can\'t create', 'Project not created.', 'error')
        console.log(error);
      });
  }

}
