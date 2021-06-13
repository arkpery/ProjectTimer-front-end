import { ThrowStmt } from '@angular/compiler';
import { Query, ViewChildren, EventEmitter, Output } from '@angular/core';
import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { cpuUsage } from 'process';
import { Column, HeaderColumn, Ribbon, Row } from "../../app/viewModels/index";
import { RibbonComponent } from '../ribbon/ribbon.component';
import moment from "moment";
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  @Input() headers: Array<HeaderColumn> = [];
  @Input() rows: Array<Row> = [];
  @Input() currentDate?: { label: string, value: Date };
  @Input() type: string = "perDay";
  @Input() selectDate: Array<{ label: string, value: Date }> = [];

  @ViewChildren("columnView") cols!: QueryList<ElementRef>;

  public styles: { [key: string]: any } = {};
  public __headers: Array<HeaderColumn> = [];
  public __currentDate?: { label: string, value: Date };
  public __rows: Array<Row> = [];
  public viewModel: { [key: string]: any } = {};
  public ribbons: Array<{ [key: string]: any }> = [];
  private columns: Array<Column> = [];

  private sortedIndex: { [key: string]: number } = {};
  public filters: Array<Date> = [];

  @Output() changeTimer = new EventEmitter<string>();

  private typesViews: { [key: string]: any } = {
    "perDay": this.perDay.bind(this),
    "perMonth": this.perMonth.bind(this),
    "perHour": this.perHour.bind(this)
  }

  constructor(public el: ElementRef) {

  }

  ngDoCheck(): void {
    const defaultView = "perDay";
    if (!this.type) {
      this.typesViews[defaultView]();
      return;
    }
    const keys = Object.keys(this.typesViews);
    const index = keys.indexOf(this.type);

    if (index > 0) {
      this.typesViews[keys[index]]();
    }
    else {
      this.typesViews[defaultView]();
    }
  }

  ngAfterViewChecked() {

  }

  removeFilter(index: number) {
    this.filters = this.filters.filter((f, i) => i !== index);
    if (this.type === "perHour") {
      const d = this.currentDate?.value;

      d?.setHours(0);
      this.currentDate = {
        label: this.currentDate?.label!,
        value: d!
      };
      this.__headers = [];
      this.__rows = [];
      this.styles = {};
      this.viewModel = {};
      this.perDay();
    }
  }

  perDay() {
    if (!this.headers) {
      this.headers = [];
    }
    if (!this.rows) {
      this.rows = [];
    }
    this.__currentDate = this.currentDate;
    this.__headers = this.headers.slice();
    for (let i = 0; i < 24; i++) {
      const date = moment().startOf("date").add(i, "hours");

      this.__headers.push({
        key: `${date.format("HH")}`
      });
    }
    this.__rows = this.rows.map((row) => {
      const r = new Row();

      r.content = row.content;
      r.author = row.author;
      r.uid = row.uid;
      r.start = row.start;
      r.stop = row.stop;
      r.columns = row.columns;
      if (this.__headers && this.__headers.length > 2) {
        const ribbons: Array<Ribbon> = [];
        if (this.currentDate) {
          const ribbon = new Ribbon();
          for (let i = 2; i < this.__headers.length; i++) {
            ribbon.content = r.content;
            ribbon.author = r.author;
            const value = this.__headers[i].key;
            const date = moment(value, "HH").toDate();

            if (date.getHours() === row.start?.getHours() &&
              this.currentDate.value.getMonth() === row.start?.getMonth() &&
              this.currentDate.value.getFullYear() === row.start?.getFullYear() &&
              this.currentDate.value.getDate() === row.start?.getDate()) {
              ribbon.colStart = this.__headers[i];
            }
            if (date.getHours() === row.stop?.getHours() &&
              this.currentDate.value.getMonth() === row.stop?.getMonth() &&
              this.currentDate.value.getFullYear() === row.stop?.getFullYear() &&
              this.currentDate.value.getDate() === row.stop?.getDate()) {
              ribbon.colEnd = this.__headers[i];
            }
          }
          ribbons.push(ribbon);
        }
        r.ribbons = ribbons;
      }
      return (r);
    });
    this.sortOnDisplay();
    this.type = "perDay";
  }

  sortOnDisplay() {
    for (let row of this.__rows) {
      for (let column of row.columns!) {
        if (!this.sortedIndex[column.key!]) {
          this.sortedIndex[column.key!] = 1;
        }
      }
    }
    const tmp = this.__rows.slice();
    this.__rows = [];

    for (let key in this.sortedIndex) {
      const rows = tmp.sort((a, b) => {
        const col1 = a.columns?.filter((col) => col.key === key)[0];
        const col2 = b.columns?.filter((col) => col.key === key)[0];

        if (col1?.value > col2?.value) {
          return (1 * this.sortedIndex[key]);
        }
        if (col1?.value < col2?.value) {
          return (-1 * this.sortedIndex[key]);
        }
        return (0);
      });
      this.__rows = rows;
    }
  }

  perMonth() {

  }

  perHour() {
    if (!this.headers) {
      this.headers = [];
    }
    if (!this.rows) {
      this.rows = [];
    }
    this.__currentDate = this.currentDate;
    this.__headers = this.headers.slice();
    for (let i = 0; i < 60; i++) {
      const date = moment(this.__currentDate?.value).add(i, "minutes");

      this.__headers.push({
        key: `${date.format("HH:mm")}`
      });
    }
    console.log(this.__headers);
    console.log(this.currentDate);
    this.__rows = this.rows.map((row) => {
      const r = new Row();

      r.content = row.content;
      r.author = row.author;
      r.uid = row.uid;
      r.start = row.start;
      r.stop = row.stop;
      r.columns = row.columns;
      if (this.__headers && this.__headers.length > 2) {
        const ribbons: Array<Ribbon> = [];

        if (this.currentDate) {
          const ribbon = new Ribbon();
          if (row.start! && this.currentDate.value.getHours() > row.start?.getHours() &&
            this.currentDate.value.getMonth() === row.start?.getMonth() &&
            this.currentDate.value.getFullYear() === row.start?.getFullYear() &&
            this.currentDate.value.getDate() === row.start?.getDate()) {
            ribbon.colStart = this.__headers[2];
          }
          if (row.stop! && this.currentDate.value.getHours() < row.stop?.getHours() &&
            this.currentDate.value.getMonth() === row.start?.getMonth() &&
            this.currentDate.value.getFullYear() === row.start?.getFullYear() &&
            this.currentDate.value.getDate() === row.start?.getDate()) {
            ribbon.colEnd = this.__headers[this.__headers.length - 1];
          }
          for (let i = 2; i < this.__headers.length; i++) {
            ribbon.content = row.content;
            ribbon.author = row.author;
            const value = this.__headers[i].key;
            const date = moment(value, "HH:mm").toDate();

            if (date.getMinutes() === row.start?.getMinutes() &&
              !ribbon.colStart &&
              this.currentDate.value.getHours() === row.start?.getHours() &&
              this.currentDate.value.getMonth() === row.start?.getMonth() &&
              this.currentDate.value.getFullYear() === row.start?.getFullYear() &&
              this.currentDate.value.getDate() === row.start?.getDate()) {
              ribbon.colStart = this.__headers[i];
            }
            if (row.stop! && date.getMinutes() === row.stop?.getMinutes() &&
              !ribbon.colEnd &&
              this.currentDate.value.getHours() === row.stop?.getHours() &&
              this.currentDate.value.getMonth() === row.stop?.getMonth() &&
              this.currentDate.value.getFullYear() === row.stop?.getFullYear() &&
              this.currentDate.value.getDate() === row.stop?.getDate()) {
              ribbon.colEnd = this.__headers[i];
            }
          }
          ribbons.push(ribbon);
        }
        r.ribbons = ribbons;
      }
      return (r);
    });
    this.type = "perHour";
    this.sortOnDisplay();
  }

  changeView(header: HeaderColumn) {
    if (header.key === "ID" || header.key === "Description") {
      const key = header.key;

      console.log(key);
      if (!this.sortedIndex[key]) {
        this.sortedIndex[key] = 1;
      }
      console.log(this.sortedIndex);

      console.log(this.__rows);
      this.sortedIndex[key] = -this.sortedIndex[key];
    }
    else if (this.type === "perDay") {
      const nb = parseInt(header.key!, 10);

      if (nb) {
        const d = this.currentDate?.value;

        d?.setHours(nb);
        d?.setMinutes(0);
        this.currentDate = {
          label: this.currentDate?.label!,
          value: d!
        };
        this.filters.push(d!);
        this.__headers = [];
        this.__rows = [];
        this.styles = {};
        this.viewModel = {};
        this.perHour();
      }
    }
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
      this.viewModel[key]["width"] = Math.ceil(headerView.scrollWidth);
    }
    if (rect.width > this.viewModel[key]["width"]) {
      this.viewModel[key]["width"] = Math.ceil(rect.width);
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
        width: Math.ceil(rect.width),
        x: Math.ceil(rect.x),
      };
    }
    this.styles[key] = {
      "min-width.px": this.viewModel[key]["width"]
    };
    return (this.styles[key]);
  }

  collectionElToHTMLElement() {
    const list = [];

    if (this.cols) {
      for (let item of this.cols) {
        list.push(item.nativeElement as HTMLElement);
      }
    }
    return (list);
  }

  ngAfterViewInit() {

  }

  changeTimers() {
    this.changeTimer.emit(this.currentDate?.label);
  }
}
