import { Injectable } from '@angular/core';
import moment from "moment";
import { Timer } from './models/Timer';
import { Column, Row } from './viewModels';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor() { }

  public apply(timers: Array<Timer>, timestamp: number) {
    if (!timers) {
      timers = [];
    }
    const t = moment(timestamp);
    let currentDate = {
      value: t.toDate(),
      label: t.format("DD/MM/YYYY")
    };
    const rows = timers.filter((timer) => {
      const time = moment(timer.startTime).toDate();

      return (time.getDate() === currentDate.value.getDate() &&
        time.getMonth() === currentDate.value.getMonth() &&
        time.getFullYear() === currentDate.value.getFullYear());
    }).map((timer, index) => {
      const row = new Row();
      const columns = [];
      const arr = ["_id", "description"];
      const mapId: any = {
        "_id": "ID",
        "description": "Description"
      };
      for (let k = 0; k < arr.length; k++) {
        const column = new Column();

        column.key = mapId[arr[k]];
        column.value = arr[k] === "_id" ? `${(index + 1)}` : (Reflect.get(timer, arr[k]) || "Pas de valeur définie");
        column.uid = k;
        columns.push(column);
      }
      const start = moment.parseZone(timer.startTime).toDate();
      const end = moment(start.getTime() + timer.duration).toDate();
      row.content = timer.taskType;
      if (timer.user) {
        row.author = timer.user.email;
      }
      row.start = start;
      row.stop = end;
      row.columns = columns;
      row.uid = index;
      return (row);
    });
    return (rows);
  }
}
