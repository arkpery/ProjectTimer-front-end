import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @Input() items: Array<any> = [];
  @Input() transform?: Function;
  @Input() title?: string;

  constructor() { }

  public load() {
    if (this.transform) {
      const { labels, values } = this.transform(this.items);

      this.pieChartLabels = labels;
      this.pieChartData = values;
    }
  }

  ngOnInit(): void {
    this.load();
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

}
