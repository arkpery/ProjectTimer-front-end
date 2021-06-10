import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/Project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  // 60c18f1982379a05b6e286a8
  token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBjMThjNDJjNzcyYWEwNTQ2NDAyNjJmIiwiZW1haWwiOiJtYXhpbWVAbWFpbC5mciJ9LCJpYXQiOjE2MjMyOTcwOTAsImV4cCI6MTYyNTg4OTA5MH0.pElOdmwMGf9H2RUr1wxunCXSZLXhKhWg1e90gvZ6R1s";
  project?: Project

  constructor(private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    window.localStorage.setItem("token", this.token);
    console.log(this.token);
    console.log(this.route.snapshot.paramMap.get("id"));
    this.projectService.findOne(this.route.snapshot.paramMap.get("id") as string).toPromise().then((project) => {
      this.project = project;
    });
  }

}
