import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/models/user/user.model";
import { UserService } from "src/app/services/users/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-profil-view",
  templateUrl: "./profil-view.component.html",
  styleUrls: ["./profil-view.component.scss"],
})
export class ProfilViewComponent implements OnInit {

  myProfil?: User;
  selectedFile = null;
  submitted = false;
  currentUser: any;
  updateForm = new FormGroup({});
  requestDone: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.CurrentUser();
    } catch (e) {
      this.requestDone = true;
    }

    this.findById(this.currentUser._id);
    this.initForm();
  }

  async CurrentUser() {
    this.currentUser = await this.userService.CurrentUser();
  }

  findById(id: string): void {
    this.userService.getUser(id).subscribe(
      (response: any) => {
        this.myProfil = response;
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onImgError(event: any) {
    event.target.src = "../../assets/avatar-default.png";
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(event);
    Swal.fire({
      title: "Do you want to save this picture ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Picture not saved", "", "info");
      }
    });
  }

  initForm() {
    this.updateForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        firstname: ["", Validators.required],
        lastname: ["", Validators.required],
        birthdate: "",
        avatar: "",
        groups: "",
        confirmPassword: ["", Validators.required],
      },
      {
        validator: this.MustMatch("password", "confirmPassword"),
      }
    );
  }

  onSubmitForm() {
    this.submitted = true;
    const formValue = this.updateForm.value;
    const updateUser = {
      email: formValue["email"],
      password: formValue["password"],
      firstname: formValue["firstname"],
      lastname: formValue["lastname"],
      birthdate: formValue["birthdate"],
      avatar: formValue["avatar"],
    } as User;
    //this.userService.update(this.currentUser._id, updateUser).subscribe(
    //  async (response: any) => {
    //    console.log(response);
    //  },
    //  (error: any) => {
    //    console.log(error);
    //  });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.updateForm.controls;
  }
}
