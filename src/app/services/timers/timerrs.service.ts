import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../models/project/Project';
import { Timer } from '../../models/timer/Timer';
import moment from "moment-timezone";
import { User } from '../../models/user/User';
import { BarChartService } from '../services.utils/bar/bar-chart-service.service';
import { PieChartService } from '../services.utils/pie/pie-chart-service.service';

@Injectable({
  providedIn: 'root'
})
export class TimerrsService {

  hostname: string = "http://localhost:7777";


  constructor(private http: HttpClient, private barChartService: BarChartService, private pieChartService: PieChartService) { 
  }


  public findByProject(project: Project) {
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

  public findByUser(user: User) {
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/user/${user._id}`, {
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

  public pieChart(timers: Array<Timer>) {
    return (this.pieChartService.apply(timers));
  }

  public barChart(timers: Array<Timer>) {
    return (this.barChartService.apply(timers));
  }

}
