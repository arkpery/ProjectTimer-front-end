import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ui-navbar',
  templateUrl: './ui-navbar.component.html',
  styleUrls: ['./ui-navbar.component.scss']
})
export class UiNavbarComponent implements OnInit {

  @Input() links: Array<any> = []; 
  active = 1;

  constructor(public route: ActivatedRoute) {  }

  ngOnInit(): void {
  
  }


}
