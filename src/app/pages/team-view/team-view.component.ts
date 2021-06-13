import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team/team.model';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {

  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.findById(this.route.snapshot.params['id']);
  }

  findById(id: string): void {
    this.teamService.getGroup(id)
      .subscribe(
        response => {
          this.teams = response;
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

}
