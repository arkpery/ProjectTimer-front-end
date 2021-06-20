import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Project } from '../../models/project/Project';
import { ProjectService } from '../../services/projects/project.service';
import { faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Group } from '../../models/team/Group';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user/User';
import { TeamService } from 'src/app/services/teams/team.service';
import { Team } from 'src/app/models/team/team.model';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

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
  currentUser!: User;
  requestDone: boolean = false;
  groupList: Array<Team> = [];
  selectedGroupId: Array<string> = [];
  createProjectForm!: FormGroup;
  selectForm!: FormGroup;

  constructor(    
    private spinner : NgxSpinnerService,
    private projectService: ProjectService,
     private userService: UserService, 
     private groupService: TeamService,
    private fb: FormBuilder,
    private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
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
    this.spinner.hide();
  }

  status(project: Project) {
    return (project.close ? "Fermé" : "En cours");
  }

  FetchTeam() {
    this.spinner.show();
    this.groupService.getAllGroup().subscribe((teams: Array<Team>) => {
      this.groupList = teams.map((team: Team) => {
        return ({
          search_label: team.name,
          _id: team._id
        });
      });
    });
    this.spinner.hide();
  }

  async CurrentUser() {
    this.spinner.show();
    this.currentUser = await this.userService.CurrentUser();
    this.spinner.hide();
  }

  async onFetchProjects() {
    this.spinner.show();
    this.projects = await this.projectService.findAll().toPromise();
    this.defaultGroupId = this.projects.map(project => this.defaultGroup(project.groups));
    this.requestDone = true;
    this.spinner.hide();
  }

  async onDeleteProject(project: Project) {
    this.spinner.show();
    await this.projectService.deleteOne(project).toPromise();
    await this.onFetchProjects();
    this.spinner.hide();
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

    if (!this.selectedGroupId || !this.selectedGroupId.length) {
      Swal.fire('Can\'t create', 'The project need at least one group.', 'error');
      return;
    }

    this.modalService.dismissAll();
    this.spinner.show();
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
      this.spinner.hide();
  }

}
