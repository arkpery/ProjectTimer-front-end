
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { OperatorFunction, Observable } from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';



const url: string = 'https://localhost:7777/users';

const UsersApi: {firstname: string,lastname : string, email: string,avatar: string }[] = [
  {'firstname': 'Ouahab', 'lastname': 'fenniche', 'email': 'fenniche@gmail.com', 'avatar': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
  {'firstname': 'Thomas', 'lastname': 'simoes', 'email': 'test@test.com', 'avatar': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
];


@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss']
})

export class TeamModalComponent implements OnInit {
  public model: any;  
  createGroupForm!: FormGroup;


Users: any [] = [
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


  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient) {}

  ngOnInit() {
    this.createGroupForm = this.fb.group({
    name: [''],
    admin: [''],
    users: ['']
});



// //Getting the data from API
// this.http.get(this.url).subscribe((response: any) => {     
//   this.users.push(...response)
//   console.log("users array", this.users);  
// })
// //Trying to get the complete array after push of the element from the service response data

console.log("users array", UsersApi);

}
  search: OperatorFunction<string, readonly {firstname: any, lastname: any, avatar: any}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : UsersApi.filter(v => v.lastname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    ) 
      

  formatter = (x: {lastname: string, firstname: string}) => x.lastname + ' ' +x.firstname ;

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
   addMemberToGroup(){
     console.log("added" )
   }
}

  






