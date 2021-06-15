import { Injectable } from '@angular/core';
import { Timer } from '../../../models/Timer';

@Injectable({
  providedIn: 'root'
})
export class PieChartService {

  constructor() { }

  public apply(timers: Array<Timer>) {
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
}
