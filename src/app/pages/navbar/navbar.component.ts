import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentUser?: User;

  constructor(private userService: UserService, private router: Router) { }

  ngDoCheck() {
    this.CurrentUser()
  }

  CurrentUser() {
    const user = window.localStorage.getItem("user");

    console.log(user);
    if (user){
      this.currentUser = JSON.parse(user);
    }
    else {
      window.localStorage.clear()
      this.currentUser = undefined;
    }
  }

  logout(event: any){
    event.preventDefault();

    window.localStorage.clear();
    this.router.navigate(['/login']);

  }

}
