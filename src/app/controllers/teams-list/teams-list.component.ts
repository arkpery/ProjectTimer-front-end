import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faCogs, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from 'src/app/models/team/team.model';
import { User } from '../../models/user/User';
import { TeamService } from 'src/app/services/teams/team.service';
import { UserService } from 'src/app/services/users/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Project } from 'src/app/models/project/Project';
import { ProjectService } from 'src/app/services/projects/project.service';


@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  faCogs = faCogs;
  faTrash = faTrash
  @Input() teams: Team[] = [];
  @Input() canAdd: boolean = true;
  @Input() view: string = "default";
  @Input() projectId!: string;

  defaultMemberId: Array<string> = [];

  createGroupForm!: FormGroup;
  selectForm!: FormGroup;
  tableForm!: FormGroup;
  selectedMembersId?: [''];
  members?: []
  currentUser?: User;
  requestDone: boolean = false;
  users: Array<User> = [];
  // list members
  userList = [];

  constructor(
    private teamService: TeamService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private projectService: ProjectService
  ) { }

  async ngOnInit(): Promise<void> {

    try {
      await this.CurrentUser();
      await this.onFetchGroups();
    }
    catch (e) {
      this.requestDone = true;
    }

    this.getAllTeams();

    // get list of users (members)
    this.getUsersList();

    this.selectForm = this.fb.group({
      members: []
    });
    this.createGroupForm = this.fb.group({
      name: ['']
    });

  }

  async onFetchGroups() {
    this.teamService.getAllGroup();
    this.users = await this.userService.findAll().toPromise();
    this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members));
    this.requestDone = true;
  }

  defaultUser(members: Array<User>) {
    if (members.length) {
      return (members[0]._id);
    }
    return ("");
  }

  // get current User 
  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
  }




  // get list all teams 
  async getAllTeams() {
    if (this.view === "default") {
      this.teamService.getAllGroup()
        .subscribe(
          (response: any) => {
            this.teams = response;
            this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members));
          },
          (error: any) => {
            console.log(error);
          });
    }
    else if (this.view === "project") {
      const project = await this.projectService.findOne(this.projectId).toPromise();
      this.teamService.getAllGroupByProject(project)
        .subscribe((response: any) => {
          this.teams = response.data;
          this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members));
        }, (error: any) => {
          console.log(error);
        });
    }
  }


  // Fetching users data 
  getUsersList() {
    console.log()
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

  // open modal to create group
  async createGroup(targetModal: any) {
    if(this.currentUser){
      deleteUser(this.userList,this.currentUser._id)
    }
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  // function used to select members added to group
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();

    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);

    let isWordThere: boolean[] = [];

    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      let search = item['search_label'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word: any) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // clear list selected 
  clearListSelectedMembers() {
    this.selectForm.get('members')?.patchValue([]);
  }

  //  create group 
  onSubmit() {
    this.modalService.dismissAll();
    const formValue = this.createGroupForm.value;
   
    let selectMembers= []
    if(this.selectedMembersId){
      selectMembers.push(this.currentUser?._id)
      selectMembers.push((this.selectedMembersId?.toString()))
    } else {
      selectMembers.push(this.currentUser?._id)
    }
    
    const newGroup = {
      name: formValue['name'],
      members: selectMembers
    } as Team;
    this.teamService.createGroup(newGroup).subscribe(
      async (response: any) => {
        console.log(response);
        const team = await this.teamService.findOne(response.data.id).toPromise();
        this.teams.push(team);
        if (this.view === "project") {
          const project = await this.projectService.findOne(this.projectId).toPromise();
          project.groups = this.teams.map(team => team._id);
          await this.projectService.update(project).toPromise();
          this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members));
          const response : any = await this.teamService.getAllGroupByProject(project).toPromise();
          this.teams = response.data;
        }
        this.clearListSelectedMembers()
        Swal.fire('successfully created!', 'Group  created.', 'success')

      },
      (error: any) => {
        Swal.fire('Can\'t create', 'Group not created.', 'error')
        console.log(error);
      });
  }

  // delete a group
  onDelete(id: string, users: Array<User>): void {
    if (!users){
      users = [];
    }
    const lengthMembers = users.length;

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
              async (response: any) => {
                if (this.view === "project") {
                  const project = await this.projectService.findOne(this.projectId).toPromise();
                  const response : any = await this.teamService.getAllGroupByProject(project).toPromise();
                  this.teams = response.data;
                  this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members));
                  project.groups = this.teams.map((team) => team._id);
                  await this.projectService.update(project).toPromise();
                  const response2 : any = await this.teamService.getAllGroupByProject(project).toPromise();
                  this.teams = response2.data;
                }
                Swal.fire('successfully deleted!', 'The group  has been deleted.', 'success')
                this.getAllTeams()
                this.onFetchGroups()
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

}

function deleteUser(arr: any[], email: any) {
  for(var i = 0; i < arr.length; i++) {
     if(arr[i]._id === email) {
       arr.splice(i, 1)
       return;
     }
  }
}