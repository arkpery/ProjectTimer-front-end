import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Team } from 'src/app/models/team/team.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  
  GROUP_URL = '/groups';

  constructor(private http: HttpClient) { }

  getAllGroup(): Observable<Team[]> {
    return this.http.get<Team[]>(environment.baseUrl + this.GROUP_URL,{ headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  getGroup(id: any): Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.baseUrl}${this.GROUP_URL}/${id}`,{ headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  createGroup(team: Team): Observable<Team[]> {
    return this.http.post<Team[]>(environment.baseUrl + this.GROUP_URL, team, { headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  updateGroup(id: any, team: Team): Observable<Team[]> {
    return this.http.put<Team[]>(`${environment.baseUrl}${this.GROUP_URL}/${id}`, team, { headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }

  deleteGroup(id: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}${this.GROUP_URL}/${id}`, { headers: {'Authorization':`${localStorage.getItem('Authorization')}`}});
  }
}
