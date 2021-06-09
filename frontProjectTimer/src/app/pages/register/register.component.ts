import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

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

  initForm(){
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

  onSubmitForm(){
    const formValue = this.registerForm.value;
    const newUser = new User(
      formValue['email'],
      formValue['password'],
      formValue['firstname'],
      formValue['lastname'],
      formValue['birthdate'],
      formValue['avatar'],
      formValue['groups']
    );
    this.userService.addUser(newUser).subscribe(
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
