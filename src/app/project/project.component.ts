import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/Project';
import { Timer } from '../models/Timer';
import { ProjectService } from '../project.service';
import { TimerrsService } from '../timerrs.service';
import { Column, HeaderColumn, Ribbon, Row } from '../viewModels';
import moment from "moment";
import { TimelineComponent } from '../timeline/timeline.component';
import { time } from 'console';
import { Group } from '../models/Group';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  // 60c18f1982379a05b6e286a8
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
    await this.FetchProject();
    await this.InitTimers(null);
  }

  async close(project: Project) {
    await this.projectService.close(project).toPromise();
    await this.FetchProject();
  }

  async update(project: Project) {
    const toUpdate : Project = {
      _id: project._id,
      name: project.name,
      close: project.close,
      groups: project.groups.map((g: Group) => g._id),
      admin: project.admin._id
    };

    await this.projectService.update(toUpdate).toPromise();
    await this.FetchProject();
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
    if (this.selectDate.length && !this.currentDate) {
      this.currentDate = this.selectDate[0];
    }
  }

  get Total() {
    const total = this.timers?.map(t => t.duration).reduce((p, v) => {
      p += v;

      return (p);
    });
    const date = moment(total).toDate()

    return (date);
  }

  async InitTimers(event: any) {
    console.log("enter ?");
    if (!this.timers) {
      this.timers = [];
    }
    if (event) {
      const t = moment(event, "DD/MM/YYYY");
      this.currentDate = {
        value: t.toDate(),
        label: event
      };
    }
    this.rows = [];
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
    this.rows = rows;
    console.log(this.rows);
  }


}
