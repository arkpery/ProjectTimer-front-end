import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Team } from 'src/app/models/team/team.model';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/team/team.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  faCog = faCog;
  faTrash = faTrash
  @Input() teams: Team[] = [];
  defaultMemberId: Array<string> = [];

  constructor(
    private teamService: TeamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.defaultMemberId = this.teams.map(team => this.defaultUser(team.members!)!);
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

  defaultUser(users: Array<User>) {
    if (users.length) {
      return (users[0]._id);
    }
    return ("");
  }

}
