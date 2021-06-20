import { Component, OnInit } from '@angular/core';
import { TimerrsService } from '../../services/timers/timerrs.service';
import { UserService } from '../../services/users/user.service';
import moment from "moment-timezone";
import { Timer } from '../../models/timer/Timer';
import { HeaderColumn, Row } from '../../viewModels';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-users-timers',
  templateUrl: './users-timers.component.html',
  styleUrls: ['./users-timers.component.scss']
})
export class UsersTimersComponent {
  selectDate: Array<{ id: number, time: Date }> = [];
  currentDate?: { id: number, time: Date };
  timers: Array<Timer> = [];
  headers: Array<HeaderColumn> = [];
  rows: Array<Row> = [];

  constructor(
    private userService: UserService,
     private timerService: TimerrsService,
     private spinner : NgxSpinnerService,
     ) {
    this.pieChart = this.pieChart.bind(this);
    this.barChart = this.barChart.bind(this);
  }

  async UpdateRows(param: any) {
    this.currentDate = param;
    if (this.timers && this.currentDate) {
      this.spinner.show();
      this.rows = this.userService.timeline(this.timers, this.currentDate.time.getTime());
      this.spinner.hide();
    }
  }


  async ngOnInit() {
   // this.spinner.show();
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
      if (this.timers && this.currentDate) {
        this.rows = this.userService.timeline(this.timers, this.currentDate.time.getTime());
      }
    }
    catch (e) {

    }
   // this.spinner.hide();
  }

  barChart(timers: Array<Timer>) {
    return (this.timerService.barChart(timers));
  }

  pieChart(timers: Array<Timer>) {
    return (this.timerService.pieChart(timers));
  }

}
