
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss']
})
export class TeamModalComponent implements OnInit {
  title = 'modal2';
  createGroupForm!: FormGroup;

  // Fake API URL
  url: string = 'https://localhost:7777/users';
  users: any [] = [
    {
        "groups": [],
        "accessToken": null,
        "_id": "60c24f1628eb53002de902d4",
        "email": "test@gmail.com",
        "firstname": "vincent",
        "lastname": "tessier",
        "birthdate": "2000-01-01T00:00:00.000Z",
        "avatar": "avatar",
        "created_at": "2021-06-10T17:42:46.092Z",
        "updated_at": "2021-06-10T17:42:46.092Z",
        "__v": 0
    },
    {
        "groups": [],
        "accessToken": null,
        "_id": "60c2affdb66ac2002c8fe5cb",
        "email": "test2@gmail.com",
        "firstname": "ouahab",
        "lastname": "fenniche",
        "birthdate": "2000-01-01T00:00:00.000Z",
        "avatar": "avatar",
        "created_at": "2021-06-11T00:36:13.015Z",
        "updated_at": "2021-06-11T00:36:13.015Z",
        "__v": 0
    }
];


  searchText: any;
  groupFilter: any = { firstname: '' };
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient) {}
 ngOnInit() {
  this.createGroupForm = this.fb.group({
   name: [''],
   admin: [''],
   members: []
  });

  // //Getting the data from API
  // this.http.get(this.url).subscribe((response: any) => {     
  //   this.users.push(...response)
  //   console.log("users array", this.users);  
  // })
  // //Trying to get the complete array after push of the element from the service response data
  
  console.log("users array", this.users);

 }



 createGroup(targetModal: any){
  this.modalService.open(targetModal, {
    centered: true,
    backdrop: 'static'
   });
   this.createGroupForm.patchValue({});
 }
 onSubmit() {
  this.modalService.dismissAll();
  console.log("res:", this.createGroupForm.getRawValue());
 }
}


  





