import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

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
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: '',
      avatar: '',
      groups: ''
    });
  }

  async CurrentUser() {
    if (!window.localStorage.getItem("token")) {
      return;
    }
    const currentUser = await this.userService.CurrentUser();

    window.localStorage.setItem("user", JSON.stringify(currentUser));
  }

  onSubmitForm() {
    const formValue = this.registerForm.value;
    const newUser = {
      email: formValue['email'],
      password: formValue['password'],
      firstname: formValue['firstname'],
      lastname: formValue['lastname'],
      birthdate: formValue['birthdate'],
      avatar: formValue['avatar'],
      groups: []
    } as User;
    this.userService.addUser(newUser).subscribe(
      async (response: any) => {
        window.localStorage.setItem("token", response.accessToken);
        await this.CurrentUser();
        this.router.navigate(['/projects']);
      },
      (error: any) => {
        console.log(error);
      });
  }

}