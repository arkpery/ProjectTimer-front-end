import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm) {
    this.userService.login(form.value)
      .subscribe(
        response => {
          localStorage.setItem('Authorization',response.user.accessToken);
          console.log(response);
          this.router.navigate(['/teams']);
        },
        error => {
          console.log(error);
        });
  }
}
