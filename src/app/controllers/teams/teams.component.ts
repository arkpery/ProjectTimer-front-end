import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from '../../models/team/team.model';
import { TeamService } from '../../services/teams/team.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
    private router: Router,
    private spinner : NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getAllTeams();
    this.spinner.hide();
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

}
