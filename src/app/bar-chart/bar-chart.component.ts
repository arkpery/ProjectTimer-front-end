import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import chart from "chart.js";
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @Input() items: Array<any> = [];
  @Input() transform?: Function;
  @Input() title?: string;

  show: boolean = false;

  constructor() { }

  public load() {
    if (this.transform) {
      const { labels, values } = this.transform(this.items);

      this.barChartLabels = labels;
      this.barChartData = values;
    }
  }

  ngOnInit(): void {
    this.load();
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: chart.ChartDataSets[] = [];
}
