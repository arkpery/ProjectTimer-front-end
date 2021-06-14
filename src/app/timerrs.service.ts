import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './models/Project';
import { Timer } from './models/Timer';
import moment from "moment-timezone";
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class TimerrsService {

  hostname: string = "http://localhost:7777";


  constructor(private http: HttpClient) { }


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

  pieChart(timers: Array<Timer>) {
    let tasks: Array<string> = [];
    let repartition: { [key: string]: number } = {};
    let values: Array<number> = [];

    for (let timer of timers) {
      if (!timer.taskType) {
        timer.taskType = "WORKING";
      }
      if (tasks.indexOf(timer.taskType) === -1) {
        tasks.push(timer.taskType);
      }
    }
    for (let timer of timers) {
      if (!timer.taskType) {
        timer.taskType = "WORKING";
      }
      if (!repartition[timer.taskType]) {
        repartition[timer.taskType] = 0;
      }
      repartition[timer.taskType] += timer.duration;
    }
    for (let task of tasks) {
      repartition[task] /= 1000;
      values.push(repartition[task]);
    }
    return {
      labels: tasks, values
    };
  }

  barChart(timers: Array<Timer>) {
    const list = [];
    let duration: any = {};
    let count: any = {};
    let current: any = {};
    let keys: Array<string> = [];


    for (let timer of timers) {
      if (!timer.taskType) {
        timer.taskType = "WORKING";
      }
      const str = moment.parseZone(timer.startTime).format("DD/MM/YYYY");

      if (current.length && current !== str) {
        const obj: any = {};

        for (let key of keys) {
          obj[key] = {
            average: duration[key] / count[key],
            day: current
          };
        }
        list.push(obj);
        for (let key of keys) {
          duration[key] = 0;
          count[key] = 0;
        }
      }
      if (keys.indexOf(timer.taskType) === -1) {
        keys.push(timer.taskType);
      }
      if (!duration[timer.taskType]) {
        duration[timer.taskType] = 0;
      }
      if (!count[timer.taskType]) {
        count[timer.taskType] = 0;
      }
      count[timer.taskType]++;
      duration[timer.taskType] += timer.duration;
      current = str;
    }
    const obj: any = {};

    for (let key of keys) {
      obj[key] = {
        average: duration[key] / count[key],
        day: current
      };
    }
    list.push(obj);
    console.log(list);
    const labels = list.map((item) => {
      for (let key in item){
        return (item[key].day);
      }
      return ("");
    });
    console.log(labels);
    const data = [];

    for (let key of keys) {
      const item: any = {};

      item.label = key;
      item.data = [];
      for (let entry of list) {
        item.data.push((entry[key].average) / 1000 / 60);
      }
      data.push(item);
    }
    return ({
      labels, values: data
    });
  }
}
