import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/Project';
import { Timer } from '../models/Timer';
import { ProjectService } from '../services/projects/project.service';
import { TimerrsService } from '../services/timers/timerrs.service';
import { Column, HeaderColumn, Ribbon, Row } from '../viewModels';
import moment from "moment-timezone";
import { Group } from '../models/Group';
import { TeamService } from '../team/team.service';
import { Team } from '../models/team/team.model';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent {
  project?: Project;
  timers?: Array<Timer>;

  headers: Array<HeaderColumn> = [];
  rows: Array<Row> = [];
  rowsEl: Array<HTMLElement> = [];
  validTimer: boolean = false;
  selectDate: Array<Date> = [];
  currentDate?: Date;
  teams: Team[] = [];

  constructor(private projectService: ProjectService, private timerService: TimerrsService, private teamService: TeamService, private route: ActivatedRoute) {
    this.pieChart = this.pieChart.bind(this);
    this.barChart = this.barChart.bind(this);
  }

  getAllTeams() {
    this.teamService.getAllGroupByProject(this.project!)
      .subscribe(
        (response: any) => {
          this.teams = response.data;
          console.log(this.teams);
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
  }

  async ngOnInit() {
    await this.FetchProject();
    if (this.timers && this.currentDate) {
      this.rows = await this.projectService.timeline(this.timers, this.currentDate.getTime());
    }
    this.getAllTeams();
  }

  async close(project: Project) {
    await this.projectService.close(project).toPromise();
    await this.FetchProject();
  }

  async update(project: Project) {
    const toUpdate: Project = {
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
    this.timers = await this.timerService.findByProject(this.project).toPromise();

    this.headers = [
      {
        key: "ID"
      },
      {
        key: "Description"
      }
    ];
    moment.locale("fr");
    this.selectDate = this.timers.map((t) => t.startTime).map((t) => moment.parseZone(t).toDate()).sort((a, b) => {
      if (a.getTime() > b.getTime()) {
        return (1);
      }
      else if (a.getTime() < b.getTime()) {
        return (-1);
      }
      return (0);
    }).reduce((p: Array<Date>, v: Date) => {
      if (!p) {
        p = [];
      }
      let flag = false;

      for (let item of p) {
        if (moment(item).format("DD/MM/YYYY") === moment(v).format("DD/MM/YYYY")) {
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
    if (!this.timers || !this.timers?.length) {
      return (moment(0).subtract(1, "hours").toDate());
    }
    const total = this.timers?.map(t => t.duration).reduce((p, v) => {
      p += v;

      return (p);
    });
    const date = moment(total).subtract(1, "hours").toDate()

    return (date);
  }

  barChart(timers: Array<Timer>) {
    console.log(this.timerService);
    return (this.timerService.barChart(timers));
  }

  pieChart(timers: Array<Timer>) {
    return (this.timerService.pieChart(timers));
  }
}
