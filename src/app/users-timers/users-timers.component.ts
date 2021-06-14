import { Component, OnInit } from '@angular/core';
import { TimerrsService } from '../timerrs.service';
import { UserService } from '../user.service';
import moment from "moment-timezone";
import { Timer } from '../models/Timer';
import { HeaderColumn, Row } from '../viewModels';

@Component({
  selector: 'app-users-timers',
  templateUrl: './users-timers.component.html',
  styleUrls: ['./users-timers.component.scss']
})
export class UsersTimersComponent {
  selectDate: Array<Date> = [];
  currentDate?: Date;
  timers: Array<Timer> = [];
  headers: Array<HeaderColumn> = [];
  rows: Array<Row> = [];

  constructor(private userService: UserService, private timerService: TimerrsService) {
    this.pieChart = this.pieChart.bind(this);
    this.barChart = this.barChart.bind(this);
  }

  async ngOnInit() {
    try {
      const user = await this.userService.CurrentUser();
      this.timers = await this.timerService.findByUser(user).toPromise();
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
      if (this.timers && this.currentDate) {
        this.rows = this.userService.timeline(this.timers, this.currentDate.getTime());
      }
    }
    catch (e) {

    }
  }

  barChart(timers: Array<Timer>) {
    console.log(this.timerService);
    return (this.timerService.barChart(timers));
  }

  pieChart(timers: Array<Timer>) {
    return (this.timerService.pieChart(timers));
  }

}
