import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/services/teams/team.service';
import { faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/project/Project';
import Swal from 'sweetalert2';
import { ProjectService } from '../../services/projects/project.service';
import { Group } from '../../models/team/Group';
import { User } from 'src/app/models/user/User';
import { UserService } from 'src/app/services/users/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {

  public team?: Team;
  public project? : Project;

  teams: Array<Team> = [];
  projects: Array<Project> = [];
  defaultGroupId: Array<string> = [];
  currentUser?: User;
  requestDone: boolean = false;
  selectedMembersId?: [''];
  defaultUserId: Array<string> = [];

  
  selectFormMembers!: FormGroup;
  // list members
  userList : Array<any> = [];
  createNewProjectFormOnTeams! : FormGroup;
  selectFormProjects!: FormGroup;
  selectedProjectsId?: string;
  projectList: Array<Team> = [];
  defaultProjectId: Array<string> = [];
  currentMembers: Array<User> = [];
  
  faCogs = faCogs;
  
  faTrash = faTrash;
  memebersAlreadySelected: Array<any> = [];
  selectedMembers: Array<any> = [];;
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.CurrentUser();
      await this.onFetchGroups();
    }
    catch (e) {
      this.requestDone = true;
    }


    this.selectFormMembers = this.fb.group({
      members: []
    });
    this.createNewProjectFormOnTeams = this.fb.group({
      name: ''
    });

    this.selectFormProjects = this.fb.group({
      projects: []
    });

     // get list of users (members)
     this.getUsersList();

      // get list of projects
     this.getProjectsList();

    this.findById(this.route.snapshot.params['id']);
    this.findProjectsByGroup(this.route.snapshot.params['id']);

  }


  // Fetching users data 
  getUsersList() {
     this.userService.findAll()
      .subscribe(
        (response: any) => {
          this.userList = response.map((o: { search_label: string; firstname: string; lastname: string; email: string; }) => {
            o.search_label =
              ` ${o.firstname}  ${o.lastname} ${o.email}
            `
            return o
          });

        },
        (error: any) => {
          console.log(error);
        });

  }
  getProjectsList() {
    this.projectService.findAll()
     .subscribe(
       (response: any) => {
         this.projectList = response.map((o: { search_label: string; name: string }) => {
           o.search_label =
             ` ${o.name}`
           return o
         });
        
       },
       (error: any) => {
         console.log(error);
       });

 }

  toJSON(team: Team) {
    return (JSON.stringify(team));
  }

  

  async onFetchGroups() {
    this.teams = await this.teamService.getAllGroup().toPromise();
    this.projects = await this.projectService.findAll().toPromise();
    this.defaultGroupId = this.projects.map(project => this.defaultGroup(project.groups));
    this.requestDone = true;
  }

  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
  }

  defaultUser(users: Array<User>) {
    if (users.length) {
      return (users[0]._id);
    }
    return ("");
  }

  defaultProject(projects: Array<Project>) {
    if (projects.length) {
      return (projects[0]._id);
    }
    return ("");
  }

  findById(id: string): void {
    this.teamService.getGroup(id)
      .subscribe(
        (response: any) => {
          this.team = response;
          this.currentMembers = response.members
          this.defaultUserId = this.team?.members
        },
        (error: any) => {
          console.log(error);
        });
  }

  findProjectsByGroup(id: string): void {
    this.teamService.getProjectByGroup(id)
      .subscribe(
        (response: any) => {
          this.projects = response;
          this.defaultGroupId = this.projects.map((project => this.defaultGroup(project.groups)));
        },
        (error: any) => {
          console.log(error);
        });
  }


  defaultGroup(groups: Array<Group>) {
    if (groups.length) {
      return (groups[0]._id);
    }
    return ("");
  }

  status(project: Project) {
    return (project.close ? "Fermé" : "En cours");
  }


  // delete a group
  onDelete(id: string, teamM: Team): void {
    const lengthMembers = Object.keys(teamM).length;
    if (lengthMembers) {
      Swal.fire('Can\'t delete', 'Group has a members!!!', 'error');
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this group!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.teamService.deleteGroup(id)
            .subscribe(
              (response: any) => {

                this.router.navigate(['/teams']);
                Swal.fire('successfully deleted!', 'The group  has been deleted.', 'success')
          
              },
              (error: any) => {
                console.log(error);
              });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your group  isn\'t deleted :)',
            'error'
          )
        }
      })
    }

  }


  updateTeam(team: Team) {
    
    this.teamService.update(team._id, team).subscribe((response: any) => {
      Swal.fire('successfully updated!', 'Team updated.', 'success');
      if (team && team._id) {
        this.findById(team._id);
        this.findProjectsByGroup(team._id);
      }
    },
      (error: any) => {
        console.log(error);
      });
  }


  async onDeleteProjectOnGroup(project: Project) {
    await this.projectService.deleteOne(project).toPromise();
    await this.onFetchGroups();
  }

  
   // delete user on team view
   deleteUserOnGroup(team: Team, idMember: string){
    this.currentMembers.forEach( (item : User, index) => {
      if(item._id === idMember) {
        this.currentMembers.splice(index,1);
      };
    });
    this.teamService.update(team._id, team).subscribe(
      (response: any) => {
        Swal.fire('successfully deleted!', 'The memeber  has been deleted.', 'success')
        if (team && team._id) {
          this.findById(team._id);
        }
        this.getUsersList();
      },
      (error: any) => {
        console.log(error);
      });
  }


  updateByAddingUser(content : any, team: Team) {
    this.memebersAlreadySelected = []
    if(team.members){
      for (let i = 0; i < team.members.length; i++) {
        this.memebersAlreadySelected.push(team.members[i]._id);
        deleteUser(this.userList,team.members[i]._id)
      }
    }
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        
        this.selectedMembers = this.memebersAlreadySelected.concat(this.selectedMembersId);
        const newMembers = {
        members: this.selectedMembers 
      } as Team;

      if(!this.selectedMembersId?.length){
        Swal.fire('Can\'t add', 'Please select a member.', 'error')
      } else {
        this.teamService.update(team._id, newMembers).subscribe(
          (response: any) => {
           
            if (team && team._id) {
              this.findById(team._id);
            }
  
            this.getUsersList();
            this.clearListSelectedMembers()
  
            Swal.fire('successfully added!', 'The memeber(s)  has been added.', 'success')
          },
          (error: any) => {
            Swal.fire('Can\'t add', 'Member not added.', 'error')
            console.log(error);
          });
      }
     
      

    }, (reason) => {
      console.log("canceled");
    });
  }

 


  updateGroupByAddingExistingProject(createProjectModalOnTeams : any,team: Team){
    this.modalService.open(createProjectModalOnTeams, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(!this.selectedProjectsId?.length){
        Swal.fire('Can\'t add', 'Please select a project.', 'error')
      } else {
        this.teamService.updateGroupByAddingProject(team._id,this.selectedProjectsId).subscribe(
          (response: any) => {
           console.log(response)
  
            if (team && team._id){
              this.findProjectsByGroup(team._id);
              this.findById(team._id);
            }
            this.clearListSelectedProjects();
            Swal.fire('project successfully added!', 'Project  created.', 'success');
            
          },
          (error: any) => {
            Swal.fire('Can\'t add', 'Project not created.', 'error')
            console.log(error);
          });
      }
       
      }, (reason) => {
         console.log("canceled");
           });
    }

  clearListSelectedMembers() {
    this.selectFormMembers.get('members')?.patchValue([]);
    
  }



  clearListSelectedProjects(){
    this.selectFormProjects.get('projects')?.patchValue([]);
  }

  

   
   /**
    * Method to serach an item from the combobox.
    * @param term {String} Term that user entered
    * @param item Item which searched by user.
    * @returns 
    */
   // function used to select members added to group
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

}



function deleteUser(arr: any[], email: any) {
  for(var i = 0; i < arr.length; i++) {
     if(arr[i]._id === email) {
       arr.splice(i, 1)
       return;
     }
  }
}