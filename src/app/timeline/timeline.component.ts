import { Query, ViewChildren } from '@angular/core';
import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { Column, HeaderColumn, Row } from "../../app/viewModels/index";
import { RibbonComponent } from '../ribbon/ribbon.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges {

  @Input() headers: Array<HeaderColumn> = [];
  @Input() rows: Array<Row> = [];
  @ViewChildren(RibbonComponent) private list!: QueryList<RibbonComponent>;

 

  constructor(public el: ElementRef) {

  }


  getHighestWidth(index: number, headers: Array<HTMLElement>, rows: Array<HTMLElement>) {
    const header = headers[index];
    const cols = [header];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const columns = row.querySelectorAll(".row-column");

      cols.push(columns[index] as HTMLElement);
    }
    const sizes = cols.map(col => Math.ceil(col.getBoundingClientRect().width));
    let max = 0;
    for (let size of sizes) {
      if (size > max) {
        max = size;
      }
    }
    return (max);
  }

  setColumnWidth(index: number, widths: Array<number>, headers: Array<HTMLElement>, rows: Array<HTMLElement>) {
    const header = headers[index] as HTMLElement;
    const width = widths[index];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const columns = row.querySelectorAll(".row-column");
      const column = columns[index] as HTMLElement;

      column.style.minWidth = `${width}px`;
      column.style.width = `100%`;
    }
    header.style.minWidth = `${width}px`;
    header.style.width = `100%`;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getTimelineWidth(){
    return ((this.el.nativeElement).getBoundingClientRect().width);
  }

  getContent(row: Row, header: HeaderColumn){
      const columns = row.columns as Array<Column>;

      for (let i = 0; i < columns.length; i++){
        const column = columns[i];

        if (header.key === column.key){
          const str = column.value.trim();

          if(str.length > 10){
            return (`${str.substr(0, 10)}...`);
          }
          return (str);
        }
      }
      return ("");
  }

  ngAfterViewInit(){
    console.log("enter");
    const headersRow = this.el.nativeElement.querySelector(".header-row");
    const rows = this.el.nativeElement.querySelector(".rows");
    const tabRow = this.el.nativeElement.querySelectorAll(".rows div.content-row");
    const tabHeader = this.el.nativeElement.querySelectorAll(".header-row .header");
    const widths = [];

    for (let i = 0; i < tabHeader.length; i++) {
      widths.push(this.getHighestWidth(i, tabHeader, tabRow));
    }
     
    for (let i = 0; i < widths.length; i++) {
      this.setColumnWidth(i, widths, tabHeader, tabRow);
    }
    for (let i = 0; i < this.list.length; i++){
      this.list.get(i)?.onLoad();
    }
  }

}
