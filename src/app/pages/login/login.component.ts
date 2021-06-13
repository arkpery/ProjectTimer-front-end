import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngDoCheck() {
    const token = window.localStorage.getItem("token");

    if (token && token.length) {
      this.router.navigate(['/projects']);
    }
  }

  
  async CurrentUser() {
    if(!window.localStorage.getItem("token")){
      return;
    }
    const currentUser = await this.userService.CurrentUser();

    window.localStorage.setItem("user", JSON.stringify(currentUser));
  }

  onSubmit(form: NgForm) {
    this.userService.login(form.value)
      .subscribe(
        async (response: any) => {
          if (response.user){
            window.localStorage.setItem("token", response.user.accessToken);

            await this.CurrentUser();
            this.router.navigate(['/projects']);
          }
        },
        (error: any) => {
          console.log(error);
        });
  }
}
