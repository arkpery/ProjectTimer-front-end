import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './models/Project';
import { Timer } from './models/Timer';

@Injectable({
  providedIn: 'root'
})
export class TimerrsService {

  hostname: string = "http://localhost:7777";


  constructor(private http: HttpClient) { }


  getAll(project : Project){
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/project/${project._id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public save(timer: Timer){
    return this.http.post(`${this.hostname}/timers`, timer, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public start(project: Project){
    return this.http.post(`${this.hostname}/timers/${project._id}/start`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public findOneByProject(project_id: string){
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/project/${project_id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public findOneByUser(user_id: string){
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/user/${user_id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public update(timer: Timer){
    return this.http.post(`${this.hostname}/timers/${timer._id}`, timer, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public stop(timer: Timer, project: Project){
    return this.http.post(`${this.hostname}/timers/${project._id}/stop/${timer._id}`, timer, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }
}
