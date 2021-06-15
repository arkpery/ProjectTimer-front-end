import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/Project';
import { Timer } from '../models/Timer';
import { ProjectService } from '../project.service';
import { TimerrsService } from '../timerrs.service';
import { Column, HeaderColumn, Ribbon, Row } from '../viewModels';
import moment from "moment";
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent  {
  // 60c18f1982379a05b6e286a8
  token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBiZjZhN2ZlNjUwOTcwMDJjOWVhOGNjIiwiZW1haWwiOiJ2aW5jZW50QGNhcnRlZ3Jpc2VleHByZXNzLmNvbSJ9LCJpYXQiOjE2MjM2NjU2NDMsImV4cCI6MTYyNjI1NzY0M30.k6iMzHF7zbpRRlLUTdkfP3cCkiV207WPX8GsHA751Do";
  project?: Project;
  timers?: Array<Timer>;

  headers: Array<HeaderColumn> = [];
  rows: Array<Row> = [];
  rowsEl: Array<HTMLElement> = [];
  validTimer: boolean = false;
  selectDate: Array<{ label: string, value: Date }> = [];
  currentDate?: { label: string, value: Date };

  constructor(private projectService: ProjectService, private timerService: TimerrsService, private route: ActivatedRoute) { }

  async ngOnInit() {
    window.localStorage.setItem("token", this.token);

    await this.FetchProject();
    await this.InitTimers();
  }

  async FetchProject() {
    this.project = await this.projectService.findOne(this.route.snapshot.paramMap.get("id") as string).toPromise();
    this.timers = await this.timerService.getAll(this.project).toPromise();

    this.headers = [
      {
        key: "ID"
      },
      {
        key: "Description"
      }
    ];
    moment.locale("fr");
    for (let i = 0; i < 24; i++) {
      const date = moment().startOf("date").add(i, "hours");

      this.headers.push({
        key: `${date.format("HH")}`
      });
    }
    this.selectDate = this.timers.map((t) => t.startTime).map((t) => moment.parseZone(t).toDate()).map((date) => {
      return {
        value: date,
        label: `${moment(date).format("DD/MM/YYYY")}`
      }
    }).sort((a, b) => {
      if (a.value.getTime() > a.value.getTime()) {
        return (1);
      }
      else if (a.value.getTime() < a.value.getTime()) {
        return (-1);
      }
      return (0);
    }).reduce((p: Array<{ label: string, value: Date }>, v: { label: string, value: Date }) => {
      if (!p) {
        p = [];
      }
      let flag = false;

      for (let item of p) {
        if (item.label === v.label) {
          flag = true;
        }
      }

      if (!flag) {
        p.push(v);
      }
      return (p);
    }, []);
    if (this.selectDate.length) {
      this.currentDate = this.selectDate[0];
    }
  }

  get Total(){
    const total = this.timers?.map(t => t.duration).reduce((p, v) => {
      p += v;

      return (p);
    });
    const date = moment(total).toDate()

    console.log(date);
    return (date);
  }

  async InitTimers() {
    if (!this.timers) {
      this.timers = [];
    }
    const rows = this.timers.filter((timer) => {
      const time = moment(timer.startTime).toDate();

      return (time.getDate() === this.currentDate?.value.getDate() && 
      time.getMonth() === this.currentDate.value.getMonth() && 
      time.getFullYear() === this.currentDate.value.getFullYear());
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
      if (this.headers && this.headers.length > 2) {
        const ribbons: Array<Ribbon> = [];
        if (this.currentDate){
          const ribbon = new Ribbon();
          for (let i = 2; i < this.headers.length; i++) {
            ribbon.content = timer.taskType;
            if (timer.user) {
              ribbon.author = timer.user.email;
            }
            const value = this.headers[i].key;
            const date = moment(value, "HH").toDate();
  
            if (date.getHours() === start.getHours() &&
              this.currentDate.value.getMonth() === start.getMonth() &&
              this.currentDate.value.getFullYear() && start.getFullYear() &&
              this.currentDate.value.getDate() && start.getDate()) {
                ribbon.colStart = this.headers[i];
            }
            if (date.getHours() === end.getHours() &&
              this.currentDate.value.getMonth() === end.getMonth() &&
              this.currentDate.value.getFullYear() && end.getFullYear() &&
              this.currentDate.value.getDate() && end.getDate()) {
                ribbon.colEnd = this.headers[i];
            }
          }
          ribbons.push(ribbon);
        }
        console.log(ribbons);
        row.ribbons = ribbons;
      }
      row.columns = columns;
      row.uid = index;
      return (row);
    });
    this.rows = rows;
  }


}
