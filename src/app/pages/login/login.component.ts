import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/user/user.model';
import Swal from 'sweetalert2';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({});
  submitted = false;

  constructor(
    private userService: UserService, 
    private router: Router, 
    private formBuilder: FormBuilder,
    private spinner : NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngDoCheck() {
    const token = window.localStorage.getItem("token");

    if (token && token.length) {
      this.router.navigate(['/projects']);
    }
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  async CurrentUser() {
    if(!window.localStorage.getItem("token")){
      return;
    }
    const currentUser = await this.userService.CurrentUser();

    window.localStorage.setItem("user", JSON.stringify(currentUser));
  }

  onSubmitForm() {
    this.submitted = true;
    const formValue = this.loginForm.value;
    const login = {
      email: formValue['email'],
      password: formValue['password']
    } as User;
    this.spinner.show();
    this.userService.login(login)
      .subscribe(
        async (response: any) => {
          if (response.user){
            window.localStorage.setItem("token", response.user.accessToken);
            await this.CurrentUser();
            this.router.navigate(['/projects']);
          }
        },
        (error: any) => {
          Swal.fire('Oops...', 'Email address or password incorrect', 'error');
          console.log(error);
        });
        this.spinner.hide();
  }

  get f() { return this.loginForm.controls; }
}
