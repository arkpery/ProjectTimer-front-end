import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
