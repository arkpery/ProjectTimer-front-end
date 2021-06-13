import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  RequestResetForm!: FormGroup;
  forbiddenEmails: any;
  errorMessage!: string;
  successMessage!: string;
  IsvalidForm = true;
  
  constructor(private userService: UserService,private router: Router
    ) { }

  ngOnInit(): void {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }

  
  RequestResetUser(form: { valid: any; }) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      this.userService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['login']);
          }, 3000);
        },
        err => {

          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
  
}
