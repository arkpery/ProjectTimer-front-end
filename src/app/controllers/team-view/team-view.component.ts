import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/services/teams/team.service';
import {  faCog,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/project/Project';
import Swal from 'sweetalert2';
import { ProjectService } from '../../services/projects/project.service';
import { Group } from '../../models/team/Group';
import { User } from 'src/app/models/user/User';
import { UserService } from 'src/app/services/users/user.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const {userList} = require('../teams-list/teams-list.component');

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {

  public team?: Team;
  teams: Array<Team> = [];
  projects: Array<Project> = [];
  defaultGroupId: Array<string> = [];
  faTrash = faTrash;
  currentUser?: User;
  requestDone: boolean = false;
  selectedMembersId?: [''];
  
  selectForm!: FormGroup;
  // list members
  userList = []
  

  currentMembers:  Array<User> = [];
  faCog = faCog;
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
    

    this.selectForm = this.fb.group({
      members: []
    });

     // get list of users (members)
     this.getUsersList();

    this.findById(this.route.snapshot.params['id']);
    this.findProjectsByGroup(this.route.snapshot.params['id']);
   

    console.log("on init")
    this.consoleLog()
    console.log("end init")
  }


  // Fetching users data 
  getUsersList() {
    console.log(userList)
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
        console.log("on getuserlist")
        this.consoleLog()
        console.log("end getuserlist")

  }

  toJSON(team: Team){
    return (JSON.stringify(team));
  }

  async onFetchGroups() {
    this.teams = await this.teamService.getAllGroup().toPromise();
    this.projects = await this.projectService.findAll().toPromise();
    this.defaultGroupId = this.projects.map(project => this.defaultGroup(project.groups));
    this.requestDone = true;
    console.log("on onFetchGroups")
        this.consoleLog()
        console.log("end onFetchGroups")
  }


  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
    console.log("on CurrentUser")
        this.consoleLog()
        console.log("end CurrentUser")
  }
  

  findById(id: string): void {
    this.teamService.getGroup(id)
      .subscribe(
        (response: any) => {
          this.team = response;
          this.currentMembers= response.members
         
        },
        (error: any) => {
          console.log(error);
        });
        console.log("on findById")
        this.consoleLog()
        console.log("end findById")
  }

  findProjectsByGroup(id: string): void {
    this.teamService.getProjectByGroup(id)
      .subscribe(
        (response: any) => {
          this.projects = response;
        },
        (error: any) => {
          console.log(error);
        });
        console.log("on findProjectsByGroup")
        this.consoleLog()
        console.log("end findProjectsByGroup")
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
    console.log("on onDelete")
        this.consoleLog()
        console.log("end onDelete")
    
  }
  

  updateByAddingUser(content : any, team: Team) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      const newMembers = {
        members: this.selectedMembersId
      } as Team;
      console.log(team._id)
      this.teamService.update(team._id, newMembers).subscribe(
        (response: any) => {
          this.router.navigate([`/teams/${team._id}`]);
          Swal.fire('successfully added!', 'The memeber(s)  has been added.', 'success')
     },
     (error: any) => {
       console.log(error);
     });
      
  }, (reason) => {
    console.log("canceled");
      });
      console.log("on updateByAddingUser")
        this.consoleLog()
        console.log("end updateByAddingUser")
  }


  


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


   // delete user on team view
   deleteUserOnGroup(team: Team, idMember: string){
    this.currentMembers.forEach( (item : User, index) => {
      if(item._id === idMember) this.currentMembers.splice(index,1);
    });
    
    this.teamService.update(team._id,team).subscribe(
      (response: any) => {
        Swal.fire('successfully deleted!', 'The memeber  has been deleted.', 'success')
        this.router.navigate([`/teams/${team._id}`]);
      },
      (error: any) => {
        console.log(error);
      });

      console.log("on deleteUserOnGroup")
        this.consoleLog()
        console.log("end deleteUserOnGroup")
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


  consoleLog(){
  console.log("teams :")
  console.log(this.teams);
  console.log("team :")
  console.log(this.team);
  console.log("projects :")
  console.log(this.projects);
  console.log("defaultGroupId :")
  console.log(this.defaultGroupId);
  console.log("currentUser :")
  console.log(this.currentUser);
  console.log("selectedMembersId :")
  console.log(this.selectedMembersId);
  console.log("selectForm :")
  console.log(this.selectForm);
  console.log("userList :")
  console.log(userList);
  console.log("currentMembers :")
  console.log(this.currentMembers);
  }

}

