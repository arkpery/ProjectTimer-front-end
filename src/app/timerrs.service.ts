import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './models/Project';
import { Timer } from './models/Timer';
import moment from "moment-timezone";
import { User } from './models/User';
import { BarChartService } from './bar-chart-service.service';
import { PieChartService } from './pie-chart-service.service';

@Injectable({
  providedIn: 'root'
})
export class TimerrsService {

  hostname: string = "http://localhost:7777";


  constructor(private http: HttpClient, private barChartService: BarChartService, private pieChartService: PieChartService) { 
    console.log(this.barChartService);
    console.log(this.pieChartService);
  }


  findByProject(project: Project) {
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/project/${project._id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  findByUser(user: User) {
    return this.http.get<Array<Timer>>(`${this.hostname}/timers/user/${user._id}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  public pieChart(timers: Array<Timer>) {

    console.log(this);
    console.log(this.barChartService);
    console.log(this.pieChartService);
    return (this.pieChartService.apply(timers));
  }

  public barChart(timers: Array<Timer>) {
    console.log(this);
    return (this.barChartService.apply(timers));
  }

}
