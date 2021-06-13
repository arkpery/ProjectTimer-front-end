import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/team/team.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  faCog = faCog;
  faTrash = faTrash
  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    this.teamService.getAllGroup()
      .subscribe(
        (response: any) => {
          this.teams = response;
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
  }

  onDelete(id: string): void {
    this.teamService.deleteGroup(id)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.router.navigate(['/teams']);
        },
        (error: any) => {
          console.log(error);
        });
  }

}
