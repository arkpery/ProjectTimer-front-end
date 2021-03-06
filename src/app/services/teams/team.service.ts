import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Team } from 'src/app/models/team/team.model';
import { environment } from 'src/environments/environment';
import { Project } from '../../models/project/Project';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  GROUP_URL = '/groups';
  PROJECT_URL = '/projects';

  constructor(private http: HttpClient) { }

  getAllGroup(): Observable<Team[]> {
    return this.http.get<Team[]>(environment.baseUrl + this.GROUP_URL, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }

  getGroup(id: any): Observable<Team> {
    return this.http.get<Team>(`${environment.baseUrl}${this.GROUP_URL}/${id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }

  getProjectByGroup(id: any): Observable<Team> {
    return this.http.get<Team>(`${environment.baseUrl}${this.PROJECT_URL}/${id}${this.GROUP_URL}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }
 

  createGroup(team : Team): Observable<Team> {
    return this.http.post(`${environment.baseUrl}${this.GROUP_URL}`, team, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }


  public update(id: any,team: Team): Observable<Team>  {
    return this.http.put(`${environment.baseUrl}${this.GROUP_URL}/${id}`, team, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }


  updateGroupByAddingProject(idGroup: any, idProject: any){
    console.log(`${environment.baseUrl}${this.GROUP_URL}/${idGroup}/project/${idProject}`)
    return this.http.put(`${environment.baseUrl}${this.GROUP_URL}/${idGroup}/project/${idProject}`,null, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });

  }

  deleteProjectOnGroup(idGroup: any, idProject: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}${this.GROUP_URL}/${idGroup}/project/delete/${idProject}`,null, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }
  

  public findOne(id: string): Observable<Team> {
    return this.http.get<Team>(`${environment.baseUrl}${this.GROUP_URL}/${id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  deleteGroup(id: any): Observable<any> {
    return this.http.delete(`${environment.baseUrl}${this.GROUP_URL}/${id}`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } });
  }

  

  getAllGroupByProject(project: Project): Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.baseUrl}${this.GROUP_URL}/project/${project._id}`, {
      headers: {
        "Authorization": `${localStorage.getItem("token")}`
      }
    });
  }
}
