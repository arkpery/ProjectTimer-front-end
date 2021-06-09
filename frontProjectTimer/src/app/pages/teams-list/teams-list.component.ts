import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService.getAll()
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

}
