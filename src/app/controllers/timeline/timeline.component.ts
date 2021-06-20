import { ViewChildren, EventEmitter, Output } from '@angular/core';
import { Component, ElementRef, Input, QueryList } from '@angular/core';
import { Column, HeaderColumn, Ribbon, Row } from "../../viewModels/index";
import moment from "moment";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  @Input() headers: Array<HeaderColumn> = [];
  @Input() rows: Array<Row> = [];
  @Input() currentDate?: { id: number, time: Date };
  @Input() type: string = "perDay";
  @Input() selectDate: Array<{ id: number, time: Date }> = [];
  selectedDate: number = 0;

  public draw: boolean = false;

  public propagate: boolean = false;

  @ViewChildren("columnView") cols!: QueryList<ElementRef>;

  public styles?: { [key: string]: any };
  public __headers?: Array<HeaderColumn>;
  public __currentDate?: Date;
  public __rows?: Array<Row>;
  public viewModel?: { [key: string]: any };
  public ribbons: Array<{ [key: string]: any }> = [];

  private sortedIndex: { [key: string]: number } = {};
  public filters: Array<Date> = [];

  @Output() public myEvent: EventEmitter<{ id: number, time: Date }> = new EventEmitter<{ id: number, time: Date }>();

  private typesViews: { [key: string]: any } = {
    "perDay": this.perDay.bind(this),
    "perMonth": this.perMonth.bind(this),
    "perHour": this.perHour.bind(this)
  }

  constructor(
    public el: ElementRef,
    private ref: ChangeDetectorRef,
  ) {

  }

  ngDoCheck(): void {
    this.draw = false;
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
      if (this.currentDate) {
        this.currentDate.time.setHours(0);
      }
      this.__headers = undefined;
      this.__rows = undefined;
      this.styles = undefined;
      this.viewModel = undefined;
      this.perDay();
      setTimeout(() => {
        if (!this.propagate) {
          this.ref.detectChanges();
          this.propagate = true;
        }

        //this.ref.detectChanges();
      }, 100);
    }
  }

  perDay() {
    this.draw = false;

    if (!this.headers) {
      this.headers = [];
    }
    if (!this.rows) {
      this.rows = [];
    }
    this.__currentDate = this.currentDate?.time;
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
              this.currentDate.time.getMonth() === row.start?.getMonth() &&
              this.currentDate.time.getFullYear() === row.start?.getFullYear() &&
              this.currentDate.time.getDate() === row.start?.getDate()) {
              ribbon.colStart = this.__headers[i];
            }
            if (date.getHours() === row.stop?.getHours() &&
              this.currentDate.time.getMonth() === row.stop?.getMonth() &&
              this.currentDate.time.getFullYear() === row.stop?.getFullYear() &&
              this.currentDate.time.getDate() === row.stop?.getDate()) {
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
    this.draw = true;
  }

  sortOnDisplay() {
    if (!this.__rows) {
      return;
    }
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
    this.draw = false;
    if (!this.headers) {
      this.headers = [];
    }
    if (!this.rows) {
      this.rows = [];
    }
    this.__currentDate = this.currentDate?.time;
    this.__headers = this.headers.slice();
    for (let i = 0; i < 60; i++) {
      const date = moment(this.__currentDate).add(i, "minutes");

      this.__headers.push({
        key: `${date.format("HH:mm")}`
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
          if (row.start! && this.currentDate.time.getHours() > row.start?.getHours() &&
            this.currentDate.time.getMonth() === row.start?.getMonth() &&
            this.currentDate.time.getFullYear() === row.start?.getFullYear() &&
            this.currentDate.time.getDate() === row.start?.getDate()) {
            ribbon.colStart = this.__headers[2];
          }
          if (row.stop! && this.currentDate.time.getHours() < row.stop?.getHours() &&
            this.currentDate.time.getMonth() === row.start?.getMonth() &&
            this.currentDate.time.getFullYear() === row.start?.getFullYear() &&
            this.currentDate.time.getDate() === row.start?.getDate()) {
            ribbon.colEnd = this.__headers[this.__headers.length - 1];
          }
          for (let i = 2; i < this.__headers.length; i++) {
            ribbon.content = row.content;
            ribbon.author = row.author;
            const value = this.__headers[i].key;
            const date = moment(value, "HH:mm").toDate();

            if (date.getMinutes() === row.start?.getMinutes() &&
              !ribbon.colStart &&
              this.currentDate.time.getHours() === row.start?.getHours() &&
              this.currentDate.time.getMonth() === row.start?.getMonth() &&
              this.currentDate.time.getFullYear() === row.start?.getFullYear() &&
              this.currentDate.time.getDate() === row.start?.getDate()) {
              ribbon.colStart = this.__headers[i];
            }
            if (row.stop! && date.getMinutes() === row.stop?.getMinutes() &&
              !ribbon.colEnd &&
              this.currentDate.time.getHours() === row.stop?.getHours() &&
              this.currentDate.time.getMonth() === row.stop?.getMonth() &&
              this.currentDate.time.getFullYear() === row.stop?.getFullYear() &&
              this.currentDate.time.getDate() === row.stop?.getDate()) {
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
    this.draw = true;
  }

  changeView(header: HeaderColumn) {
    if (header.key === "ID" || header.key === "Description") {
      const key = header.key;

      if (!this.sortedIndex[key]) {
        this.sortedIndex[key] = 1;
      }
      this.sortedIndex[key] = -this.sortedIndex[key];
    }
    else if (this.type === "perDay") {
      const nb = parseInt(header.key!, 10);

      if (this.currentDate) {
        this.currentDate.time.setHours(nb);
        this.currentDate.time.setMinutes(0);
        this.filters.push(this.currentDate.time);
      }
      this.__headers = undefined;
      this.__rows = undefined;
      this.styles = undefined;
      this.viewModel = undefined;
      this.perHour();
      setTimeout(() => {
        if (!this.propagate) {
          this.ref.detectChanges();
          this.propagate = true;
        }
      }, 100);
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

    if (!this.viewModel) {
      this.viewModel = {};
    }
    if (!this.styles) {
      this.styles = {};
    }
    if (!this.viewModel[key]) {
      this.viewModel[key] = {};
    }
    if (!this.styles[key]) {
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

    if (!this.viewModel) {
      this.viewModel = {};
    }
    if (!this.styles) {
      this.styles = {};
    }
    if (!this.viewModel[key]) {
      this.viewModel[key] = {};
    }
    if (!this.styles[key]) {
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
    this.styles[key]["min-width.px"] = this.viewModel[key]["width"];
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

  compareWith(a: { id: number, time: Date }, b: { id: number, time: Date }) {
    return (a.id === b.id);
  }

  changeTimers(param: { id: number, time: Date }) {
    this.currentDate = param;
    this.myEvent.emit(param);
  }

  parent(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const style = {
      "min-width.px": rect.width
    };

    return (style);
  }
}