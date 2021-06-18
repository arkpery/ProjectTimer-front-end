import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user/User';
import { UserService } from 'src/app/services/users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profil-view',
  templateUrl: './profil-view.component.html',
  styleUrls: ['./profil-view.component.scss']
})
export class ProfilViewComponent implements OnInit {

  selectedFile = null;
  submitted = false;
  currentUser: any;
  updateForm = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.findById();
    this.initForm();
  }

  findById() {
    this.userService.CurrentUser().then(
      res => {
        this.currentUser = res;
        console.log(res);
      }
    );
  }

  onImgError(event :any){
    event.target.src = '../../assets/avatar-default.png';
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    console.log(event);
    Swal.fire({
      title: 'Do you want to save this picture ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Picture not saved', '', 'info')
      }
    })
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      email: this.currentUser.email,
      password: this.currentUser.password,
      firstname: this.currentUser.firstname,
      lastname: this.currentUser.lastname,
      birthdate: this.currentUser.birthdate,
      avatar: this.currentUser.avatar,
      groups: this.currentUser.groups
    });
  }
  

  onSubmitForm() {
    this.submitted = true;
    const formValue = this.updateForm.value;
    const updateUser = {
      _id: this.currentUser._id,
      email: formValue['email'],
      password: formValue['password'],
      firstname: formValue['firstname'],
      lastname: formValue['lastname'],
      birthdate: formValue['birthdate']
    } as User;
    this.userService.update(updateUser).subscribe(
      async (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      });
  }

}