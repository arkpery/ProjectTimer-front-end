import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/team/team.service';
import {  faCog,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/Project';
import Swal from 'sweetalert2';
import { ProjectService } from '../../project.service';
import { Group } from '../../models/Group';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/user.service';


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


  currentMembers:  Array<User> = [];
  faCog = faCog;
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.CurrentUser();
      await this.onFetchGroups();
    }
    catch (e) {
      this.requestDone = true;
    }
    
    this.findById(this.route.snapshot.params['id']);
    this.findProjectsByGroup(this.route.snapshot.params['id']);
   
  }

  toJSON(team: Team){
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
    console.log("enter");
    console.log(this.currentUser);
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
    
  }
  
   // delete user on team view
   deleteUserOnGroup(team: Team, idMember: string){
    this.currentMembers.forEach( (item : User, index) => {
      if(item._id === idMember) this.currentMembers.splice(index,1);
    });
    
    this.teamService.update(team).subscribe(
      (response: any) => {
        this.router.navigate([`/teams/${team._id}`]);
      },
      (error: any) => {
        console.log(error);
      });
   }
}

