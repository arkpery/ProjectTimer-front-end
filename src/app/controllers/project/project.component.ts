import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project/Project';
import { Timer } from '../../models/timer/Timer';
import { ProjectService } from '../../services/projects/project.service';
import { TimerrsService } from '../../services/timers/timerrs.service';
import { Column, HeaderColumn, Ribbon, Row } from '../../viewModels';
import moment from "moment-timezone";
import { Group } from '../../models/team/Group';
import { TeamService } from '../../services/teams/team.service';
import { Team } from '../../models/team/team.model';
import { group } from '@angular/animations';
import { User } from 'src/app/models/user/User';
import { BarChartComponent } from 'src/app/bar-chart/bar-chart.component';
import { PieChartComponent } from 'src/app/pie-chart/pie-chart.component';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent {
  project?: Project;
  timers: Array<Timer> = [];

  headers: Array<HeaderColumn> = [];
  rows: Array<Row> = [];
  rowsEl: Array<HTMLElement> = [];
  validTimer: boolean = false;
  selectDate: Array<{ id: number, time: Date }> = [];
  currentDate?: { id: number, time: Date };
  teams: Team[] = [];

  @ViewChild(BarChartComponent) elBarChart!: BarChartComponent;
  @ViewChild(PieChartComponent) elPieChart!: PieChartComponent;


  constructor(private projectService: ProjectService, private timerService: TimerrsService, private teamService: TeamService, private route: ActivatedRoute) {
    this.pieChart = this.pieChart.bind(this);
    this.barChart = this.barChart.bind(this);
    this.Reload = this.Reload.bind(this);
  }

  getAllTeams() {
    this.teamService.getAllGroupByProject(this.project!)
      .subscribe(
        (response: any) => {
          this.teams = response.data;
        },
        (error: any) => {
          console.log(error);
        });
  }

  async ngOnInit() {
    await this.FetchProject();
    if (this.timers && this.currentDate) {
      this.rows = await this.projectService.timeline(this.timers, this.currentDate.time.getTime());
    }
    this.getAllTeams();
  }

  async close(project: Project) {
    await this.projectService.close(project).toPromise();
    await this.FetchProject();
  }

  async UpdateRows(param: any) {
    this.currentDate = param;
    if (this.timers) {
      this.rows = await this.projectService.timeline(this.timers, this.currentDate?.time.getTime()!);
    }
  }

  public async Reload() {
    this.timers = [];
    if (this.project && this.elPieChart && this.elBarChart) {
      try {
        this.timers = await this.timerService.findByProject(this.project).toPromise();
        this.rows = await this.projectService.timeline(this.timers, this.currentDate?.time.getTime()!);
        this.elPieChart.load();
        this.elBarChart.load();
      }
      catch (e){
        console.log(e.message);
      }
    }
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
    this.selectDate = this.timers.map((t, index) => { return { id: index, time: moment.parseZone(t.startTime).toDate() } }).sort((a, b) => {
      if (a.time.getTime() > b.time.getTime()) {
        return (1);
      }
      else if (a.time.getTime() < b.time.getTime()) {
        return (-1);
      }
      return (0);
    }).reduce((p: Array<{ id: number, time: Date }>, v: { id: number, time: Date }) => {
      if (!p) {
        p = [];
      }
      let flag = false;

      for (let item of p) {
        if (moment(item.time).format("DD/MM/YYYY") === moment(v.time).format("DD/MM/YYYY")) {
          flag = true;
        }
      }
      v.time.toString = () => {
        return (moment(v.time).format("DD/MM/YYYY"));
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
    const total = this.timers?.map(t => t.duration ?? 0).reduce((p, v) => {
      p += v;

      return (p);
    });
    const hours = total / (1000 * 3600);
    const minutes = (total / (1000 * 60)) % 60;

    return (`${hours}h `);
  }

  barChart(timers: Array<Timer>) {
    return (this.timerService.barChart(timers));
  }

  pieChart(timers: Array<Timer>) {
    return (this.timerService.pieChart(timers));
  }
}
