import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/team/team.service';
import {  faCog,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/Project';
import Swal from 'sweetalert2';
import { ProjectService } from '../../project.service';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {

  public team?: Team;
  project?: Project;
  teamsProject: Team[] = [];
  faTrash = faTrash;
  faCog = faCog;
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.findById(this.route.snapshot.params['id']);
  }

  toJSON(team: Team){
    return (JSON.stringify(team));
  }

  findById(id: string): void {
    this.teamService.getGroup(id)
      .subscribe(
        (response: any) => {
          this.team = response;
        },
        (error: any) => {
          console.log(error);
        });
  }


   getAllProjectsByGroup() {
    
  }

  


  // delete a group
  onDelete(id: string, teamM: Team): void {
    const lengthMembers = Object.keys(teamM).length;
    if(lengthMembers){
      Swal.fire('Oops', 'Group has a members!!!', 'error');
    } else {
      this.teamService.deleteGroup(id)
      .subscribe(
        (response: any) => {
          Swal.fire('Whooa!', 'Group has a members!!!', 'success')
          this.router.navigate(['/teams']);
        },
        (error: any) => {
          console.log(error);
        });
    }
    
  }
  
}

