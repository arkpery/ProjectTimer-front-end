import { Component, OnInit } from '@angular/core';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  faCog = faCog;
  faTrash = faTrash
  teams: Team[] = [];

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    this.teamService.getAll()
      .subscribe(
        response => {
          this.teams = response;
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  editGroup(){

  }

  deleteGroup() {
    
  }

}
