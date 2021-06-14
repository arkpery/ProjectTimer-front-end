import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './models/Project';
import { Timer } from './models/Timer';
import { TimelineService } from './timeline-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  hostname: string = "http://localhost:7777";


  constructor(private http: HttpClient, private timelineService: TimelineService) { }

  public findAll(): Observable<Array<Project>> {
    return this.http.get<Array<Project>>(`${this.hostname}/projects`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public findOne(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.hostname}/projects/${id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public save(project: Project) {
    return this.http.post(`${this.hostname}/projects`, project, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public update(project: Project) {
    return this.http.put(`${this.hostname}/projects/${project._id}`, project, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public deleteOne(project: Project) {
    return this.http.delete(`${this.hostname}/projects/${project._id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public close(project: Project) {
    return this.http.put(`${this.hostname}/projects/${project._id}/close`, null, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public timeline(timers: Array<Timer>, timestamp: number) {
    return (this.timelineService.apply(timers, timestamp));
  }

}
