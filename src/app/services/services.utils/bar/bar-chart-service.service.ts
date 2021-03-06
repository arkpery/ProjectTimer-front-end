import { Injectable } from '@angular/core';
import { Timer } from '../../../models/timer/Timer';
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

    timers = timers.sort((a: Timer, b: Timer) => {
      if (a.startTime > b.startTime) {
        return (1);
      }
      if (a.startTime < b.startTime) {
        return (-1);
      }
      return (0);
    });
    for (let timer of timers) {
      if (!timer.taskType) {
        timer.taskType = "WORKING";
      }
      if (!timer.duration) {
        timer.duration = 0;
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
          count[key] = 1;
        }
      }
      if (keys.indexOf(timer.taskType) === -1) {
        keys.push(timer.taskType);
      }
      if (!duration[timer.taskType]) {
        duration[timer.taskType] = 0;
      }
      if (!count[timer.taskType]) {
        count[timer.taskType] = 1;
      }
      else {
        count[timer.taskType]++;
      }
      duration[timer.taskType] += timer.duration;
      current = str;
    }
    const obj: any = {};

    for (let key of keys) {
      if (!duration[key]) {
        duration[key] = 0;
      }
      if (!count[key]) {
        count[key] = 1;
      }
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
        if (!entry[key]) {
          entry[key] = {
            average: 0
          };
        }
        item.data.push((entry[key].average) / 1000 / 60);
      }
      data.push(item);
    }
    return ({
      labels, values: data
    });
  }
}
