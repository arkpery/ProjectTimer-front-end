import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from 'src/app/models/team/team.model';
import { User } from '../../models/User';
import { TeamService } from 'src/app/team/team.service';
import { UserService } from 'src/app/services/users/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  faCog = faCog;
  faTrash = faTrash
  @Input() teams: Team[] = [];
  @Input() canAdd: boolean = true;
  defaultMemberId: Array<string> = [];
  ADD_URL = '/users';

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
    private http: HttpClient, 
    private userService: UserService,
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

    console.log("******")
     console.log(this.defaultMemberId);

    this.selectForm = this.fb.group({
      members: []
    });
    this.createGroupForm = this.fb.group({
      name: ['']
    });

  }

  async onFetchGroups() {
    this.teams = await this.teamService.getAllGroup().toPromise();
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


  // update group
  // async update(team: Team) {
  //    const toUpdate: Team = {
  //      _id: team._id,
  //     members: team.members.map((g: User) => g._id)
  //   };

  //   await this.teamService.update(toUpdate).toPromise();
  // }

  

  // get list all teams 
  getAllTeams() {
    this.teamService.getAllGroup()
      .subscribe(
        (response: any) => {
          this.teams = response;
        },
        (error: any) => {
          console.log(error);
        });
  }


  // Fetching users data 
  getUsersList() {
    this.http
      .get<any>(environment.baseUrl+this.ADD_URL, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
      .subscribe(response => {
        this.userList = response.map((o: { search_label: string; firstname: string; lastname: string; email: string; }) => {
          o.search_label =
            ` ${o.firstname}  ${o.lastname} ${o.email}
          `
          return o
        });
        console.log(this.userList)
      }, error => {
        console.log(error);
      });
  }


  // open modal to create group
  async createGroup(targetModal: any){
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
  clearListSelected() {
    console.log("selected clear")
    this.selectForm.get('members')?.patchValue([]);
  }

   //  create group 
   onSubmit(){
    this.modalService.dismissAll();
    const formValue = this.createGroupForm.value;
    const newGroup = {
      name: formValue['name'],
      members: this.selectedMembersId
    } as Team;
    this.teamService.createGroup(newGroup).subscribe(
      async (response: any) => {
        this.getAllTeams();
        this.router.navigate(['/teams']);
      },
      (error: any) => {
        console.log(error);
      });
  }
   
  // delete a group
  onDelete(id: string, teamM: Team): void {
    const lengthMembers = Object.keys(teamM).length;
    if(lengthMembers){
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
          Swal.fire('successfully deleted!', 'The group  has been deleted.', 'success')
          this.getAllTeams();
          this.router.navigate(['/teams']);
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
