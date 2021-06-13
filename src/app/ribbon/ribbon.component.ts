import { HostListener } from '@angular/core';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { off } from 'process';
import { HeaderColumn, Ribbon, Row } from '../viewModels';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent implements OnInit {
  @Input() ribbon!: Ribbon;
  @Input() row!: Row;
  @Input() headers: Array<HeaderColumn> = [];
  @Input() timelineEl!: ElementRef<any>;



  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  getColumn(index: number, tabRows: NodeListOf<Element>) {
    const row = tabRows[this.row.uid];
    const columns = row.querySelectorAll(".row-column");

    return (columns[index - 1] as HTMLElement);
  }

  getHeaderColumns() {
    const el = this.timelineEl.nativeElement as HTMLElement;
    const columns = el.querySelectorAll(".header");
    const arr = [];

    for (let i = 0; i < columns.length; i++) {
      arr.push(columns[i]);
    }
    return (arr);
  }

  onLoad() {
    const rootEl = this.timelineEl.nativeElement as HTMLElement;
    const ribbonEl = (this.el.nativeElement as HTMLElement).querySelector(".ribbon") as HTMLElement;
    const ribbon = ribbonEl.getBoundingClientRect();
    const tabRows = rootEl.querySelectorAll(".rows .content-row");
    const tab = [];

    for (let i = this.ribbon.colNo; i <= this.ribbon.end; i++) {
      tab.push(this.getColumn(i, tabRows));
    }
    const ret = [];
    for (let column of tab) {
      ret.push(column);
    }
    if (ret.length) {
      const item = ret[0];
      const r = this.el.nativeElement as HTMLElement;

      const width = ret.map((item) => {
        return (item.getBoundingClientRect());
      }).map((rect) => {
        return rect.width
      }).reduce((p, v) => {
        p += v;

        return (p);
      });
      ribbonEl.style.left = `${Math.round(item.getBoundingClientRect().x) - Math.round(rootEl.getBoundingClientRect().x)}px`;
      ribbonEl.style.width = `${Math.floor(width)}px`;
      ribbonEl.style.top = `${Math.round(item.getBoundingClientRect().y) - (rootEl.querySelector(".timeline") as HTMLElement).getBoundingClientRect().y + Math.round(item.getBoundingClientRect().height / 2) - Math.round((r.querySelector(".ribbon") as HTMLElement).getBoundingClientRect().height / 2)}px`;
    }
  }

  taskType() {
    return (this.ribbon.content ? this.ribbon.content : "WORKING");
  }

}
