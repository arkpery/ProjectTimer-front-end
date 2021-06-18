import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../models/project/Project';
import { User } from '../../models/user/User';
import { Timer } from '../../models/timer/Timer';
import { ProjectService } from '../../services/projects/project.service';
import { UserService } from '../../services/users/user.service';
import { TimerrsService } from '../../services/timers/timerrs.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit { 
  @Input() project!: Project;
  @Input() reload!: Function;
  closeResult = '';
  interval: any;
  time = new Date(0);
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
 //   await this.getProject();
    await this.CurrentUser();
    this.initTimerForm();  
    this.timerForm.get('user')?.disable();
    this.timerForm.get('project')?.disable(); 
  }

  async CurrentUser(){
    this.currentUser = await this.userService.CurrentUser();
    console.log("enter");
    console.log(this.currentUser);
  }

  /*
  async getProject(){
    this.project = await this.projectService.findOne("60c72ad63ca3db002de75f67").toPromise();
    console.log(this.project);
  }
  */

  initTimerForm(){
    this.timerForm = this.formBuilder.group({
      description: ['', Validators.required],
      taskType: ['', Validators.required],
      user: [this.currentUser._id, Validators.required],
      startTime: '',
      duration: '',
      project: [this.project._id, Validators.required]
    });
  }

  onSubmitForm(){
    const formValue = this.timerForm.value;
    const newTimer: Timer = {
      description: formValue['description'],
      taskType: formValue['taskType'],
      user: this.currentUser._id,
      startTime: formValue['startTime'],
      duration: formValue['duration'],
      project: this.project._id
    };
    console.log("this.time : " + this.time);
    console.log(newTimer);
    this.timerrsService.save(newTimer).subscribe(
        async (response) => {
          Swal.fire('Whooa!', 'Task has a created', 'success');
          console.log(response);
          await this.reload();
        },
        error => {
          Swal.fire('Oops', error, 'error');
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
      this.timerForm.controls['duration'].setValue(this.time.setSeconds(this.time.getSeconds() + 1));
    },1000);
  }

  pauseTimer(){
    clearInterval(this.interval);
  }

  resetTimer(){
    this.time.setSeconds(0);
  }
}