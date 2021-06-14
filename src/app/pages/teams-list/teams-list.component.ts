import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from 'src/app/models/team/team.model';
import { User } from '../../models/User';
import { TeamService } from 'src/app/team/team.service';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';


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
      name: [''],
      members: ['']
    });

  }


  // get current User 
  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
    console.log("enter");
    console.log(this.currentUser);
  }


  // update group
  async update(team: Team) {
     const toUpdate: Team = {
       _id: team._id,
      members: team.members.map((g: User) => g._id)
    };

    await this.teamService.update(toUpdate).toPromise();
  }

  

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
      .get<any>(environment.baseUrl+this.ADD_URL)
      .subscribe(response => {
        this.userList = response.map((o: { search_label: string; firstname: string; lastname: string; email: string; }) => {
          o.search_label =
            ` ${o.firstname}  ${o.lastname} ${o.email}
          `
          return o
        });
        console.log(this.userList);

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
     console.log("current user : "+this.currentUser?._id);

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
        console.log(response);
        this.getAllTeams();
        this.router.navigate(['/teams']);
      },
      (error: any) => {
        console.log(error);
      });
  }
   
  // delete a group
   onDelete(id: string): void {
    this.teamService.deleteGroup(id)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getAllTeams();
          this.router.navigate(['/teams']);
        },
        (error: any) => {
          console.log(error);
        });
  }

  

}
