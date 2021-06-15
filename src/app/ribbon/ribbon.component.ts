import { HostListener, ViewChild } from '@angular/core';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Column, HeaderColumn, Ribbon, Row } from '../viewModels';
import moment from "moment";

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent  {
  @Input() ribbon!: Ribbon;
  @Input() timeline!: DOMRect;
  @Input() columnView!: HTMLElement;
  @Input() column!: Column;
  @Input() type: string = "";

  @ViewChild("view") ribbonView!: ElementRef;

  public style: {[key:string]: any} = {};

  constructor(private el: ElementRef) { }


  ngDoCheck(){
    const rect = this.columnView.getBoundingClientRect();
    if (this.type === "perHour"){
      const end = moment(this.ribbon.colEnd?.key!, "HH:mm").toDate().getMinutes();
      const start = moment(this.ribbon?.colStart?.key!, "HH:mm").toDate().getMinutes();
      const diff =  end - start;
      console.log(diff);
      if (Number.isNaN(diff)){
        this.style["display"] = "none";
      }
      else {
        const totalWidth = rect.width * (diff + 1);
        this.style["min-width.px"] = totalWidth;
      }
    }
    else if (this.type === "perDay"){
      const diff = parseInt(this.ribbon.colEnd?.key!, 10) - parseInt(this.ribbon?.colStart?.key!, 10);
  
      if (Number.isNaN(diff)){
        this.style["display"] = "none";
      }
      else {
        const totalWidth = rect.width * (diff + 1);
        this.style["min-width.px"] = totalWidth;
      }
    }
  }

  taskType() {
    return (this.ribbon.content ? this.ribbon.content : "WORKING");
  }

  ngAfterViewInit() {
  }

}
