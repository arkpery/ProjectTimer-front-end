import { HostListener, ViewChild } from '@angular/core';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { off } from 'process';
import { Column, HeaderColumn, Ribbon, Row } from '../viewModels';

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

  @ViewChild("view") ribbonView!: ElementRef;

  public style: {[key:string]: any} = {};

  constructor(private el: ElementRef) { }


  ngDoCheck(){
    const rect = this.columnView.getBoundingClientRect();
    const diff = parseInt(this.ribbon.colEnd?.key!, 10) - parseInt(this.ribbon?.colStart?.key!, 10);
    const totalWidth = rect.width * diff;

    this.style["min-width.px"] = totalWidth;
  }

  taskType() {
    return (this.ribbon.content ? this.ribbon.content : "WORKING");
  }

  ngAfterViewInit() {
    console.log("hello");
  }

}
