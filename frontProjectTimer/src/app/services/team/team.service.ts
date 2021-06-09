import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Team } from 'src/app/models/team/team.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];
  teamSubject = new Subject<Team[]>();

  GROUP_URL = '/groups';

  constructor(private http: HttpClient) { }

  emitUsers() {
    this.teamSubject.next(this.teams.slice());
  }

  getAll(): Observable<any> {
    return this.http.get(environment.baseUrl + this.GROUP_URL,{ headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  get(id: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}${this.GROUP_URL}/${id}`,{ headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  create(team: Team): Observable<any> {
    return this.http.post(environment.baseUrl + this.GROUP_URL, team, { headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  update(id: any, team: Team): Observable<any> {
    return this.http.post(`${environment.baseUrl}${this.GROUP_URL}/${id}`, team, { headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }
}
