import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Timer } from '../models/Timer';
import { ProjectService } from '../project.service';
import { UserService } from '../user.service';
import { TimerrsService } from '../timerrs.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  closeResult = '';
  interval: any;
  time = new Date(0);
  project!: Project;
  currentUser!: User;
  timerForm = new FormGroup({});

  constructor(
    private modalService: NgbModal, 
    private projectService: ProjectService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private timerrsService: TimerrsService
    ) {}

  async ngOnInit() {
    await this.getProject();
    await this.CurrentUser();
    this.initTimerForm();
  }

  async CurrentUser(){
    this.currentUser = await this.userService.CurrentUser();
    console.log("enter");
    console.log(this.currentUser);
  }

  async getProject(){
    this.project = await this.projectService.findOne("60c72ad63ca3db002de75f67").toPromise();
    console.log(this.project);
  }

  initTimerForm(){
    this.timerForm = this.formBuilder.group({
      description: ['', Validators.required],
      taskType: ['', Validators.required],
      user: ['', Validators.required],
      startTime: '',
      duration: '',
      project: ['', Validators.required]
    });
  }

  onSubmitForm(){
    const formValue = this.timerForm.value;
    const newTimer: Timer = {
      _id: '',
      description: formValue['description'],
      taskType: formValue['tasksType'],
      user: formValue['user'],
      startTime: formValue['startTime'],
      duration: formValue['duration'],
      project: formValue['project']
    };
    this.timerrsService.save(newTimer).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });    
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  startTimer(){
    this.interval = setInterval(() => {
      this.time.setSeconds(this.time.getSeconds() + 1);
    },1000);
  }

  pauseTimer(){
    clearInterval(this.interval);
  }

  resetTimer(){
    this.time.setSeconds(0);
  }
}