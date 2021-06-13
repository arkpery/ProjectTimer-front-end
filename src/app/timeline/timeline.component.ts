import { ThrowStmt } from '@angular/compiler';
import { Query, ViewChildren } from '@angular/core';
import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { cpuUsage } from 'process';
import { Column, HeaderColumn, Ribbon, Row } from "../../app/viewModels/index";
import { RibbonComponent } from '../ribbon/ribbon.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() headers: Array<HeaderColumn> = [];
  @Input() rows: Array<Row> = [];

  @ViewChildren("columnView") cols!: QueryList<ElementRef>;

  public styles: { [key: string]: any } = {};
  public viewModel: { [key: string]: any } = {};
  public ribbons: Array<{ [key: string]: any }> = [];
  private columns: Array<Column> = [];

  constructor(public el: ElementRef) {

  }

  ngOnInit(): void {

  }

  ngAfterViewChecked() {

  }

  get BoundingClientRect() {
    return ((this.el.nativeElement).getBoundingClientRect());
  }

  getContent(row: Row, header: HeaderColumn) {
    const columns = row.columns as Array<Column>;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (header.key === column.key) {
        const str = column.value.trim();

        return (str);
      }
    }
    return ("");
  }

  adjustHeader(headerModel: HeaderColumn, headerView: HTMLElement) {
    const key = headerModel.key!;

    if (!this.viewModel[key]) {
      this.viewModel[key] = {};
      this.styles[key] = {};
    }
    const rect = headerView.getBoundingClientRect();

    if (!this.viewModel[key]["width"]) {
      this.viewModel[key]["width"] = headerView.scrollWidth;
    }
    if (rect.width > this.viewModel[key]["width"]) {
      this.viewModel[key]["width"] = rect.width;
    }
    return (this.styles[key]);
  }

  adjustRow(row: Row, view: HTMLElement) {
    return {};
  }


  verifyRibbon(row: Row, column: HeaderColumn) {
    const ribbons = row.ribbons!;

    for (let ribbon of ribbons) {
      if (ribbon.colStart?.key === column.key) {
        return (ribbon);
      }
    }
    return (null);
  }

  getRibbon(row: Row, column: HeaderColumn) {
    const ribbons = row.ribbons!;

    for (let ribbon of ribbons) {
      if (ribbon.colStart?.key === column.key) {
        return (ribbon);
      }
    }
    return (null);
  }

  adjustColumn(column: HeaderColumn, view: HTMLElement) {
    const key = column.key!;

    if (!this.viewModel[key]) {
      this.viewModel[key] = {};
      this.styles[key] = {};
    }
    const rect = view.getBoundingClientRect();
    if (!this.viewModel[key]["width"]) {
      this.viewModel[key] = {
        width: 0,
        x: 0,
      };
    }
    if (rect.width > this.viewModel[key]["width"]) {
      this.viewModel[key] = {
        width: rect.width,
        x: rect.x,
      };
    }
    this.styles[key] = {
      "min-width.px": this.viewModel[key]["width"]
    };
    return (this.styles[key]);
  }

  collectionElToHTMLElement(){
    const list = [];

    if (this.cols){
      for (let item of this.cols){
        list.push(item.nativeElement as HTMLElement);
      }
    }
    return (list);
  }

  ngAfterViewInit() {

  }

}
