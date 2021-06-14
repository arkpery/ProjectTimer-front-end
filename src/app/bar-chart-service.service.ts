import { Injectable } from '@angular/core';
import { Timer } from './models/Timer';
import moment from "moment-timezone";

@Injectable({
  providedIn: 'root'
})
export class BarChartService {

  constructor() { }

  public apply(timers: Array<Timer>) {
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
    const labels = list.map((item) => {
      for (let key in item) {
        return (item[key].day);
      }
      return ("");
    });
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
