import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user/User';
import { UserService } from 'src/app/services/users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({});
  submitted = false;
  

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
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    this.submitted = true;
    const formValue = this.registerForm.value;
    const newUser = {
      email: formValue['email'],
      password: formValue['password'],
      firstname: formValue['firstname'],
      lastname: formValue['lastname'],
      birthdate: formValue['birthdate'],
      avatar: formValue['avatar']
    } as User;
    this.userService.addUser(newUser).subscribe(
      async (response: any) => {
        window.localStorage.setItem("token", response.accessToken);
        await this.CurrentUser();
        this.router.navigate(['/projects']);
      },
      (error: any) => {
        Swal.fire('Oops...', 'erreur', 'error');
        console.log(error);
      });
  }

  get f() { return this.registerForm.controls; }

}
