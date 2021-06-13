
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import {  UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss']
})

export class TeamModalComponent implements OnInit {
  console = console; 
  createGroupForm!: FormGroup;
  selectForm!: FormGroup;
  selectedMembersId: string[] = [];
  selectedMembers : string[] = [];
  
  // list members
  userList = [];

  ADD_URL = '/users';
    
  users =  [
    {
      groups: [],
      accessToken: null,
      _id: '60c24f1628eb53002de902d4',
      email: 'test@gmail.com',
      firstname: 'ouahab',
      lastname: 'fenniche',
      birthdate: '2000-01-01T00:00:00.000Z',
      avatar: 'avatar',
      created_at: '2021-06-10T17:42:46.092Z',
      updated_at: '2021-06-10T17:42:46.092Z',
      __v: 0
    },
    {
      groups: [],
      accessToken: null,
      _id: '60c2affdb66ac2002c8fe5cb',
      email: 'test2@gmail.com',
      firstname: 'vincent',
      lastname: 'tessier',
      birthdate: '2000-01-01T00:00:00.000Z',
      avatar: 'avatar',
      created_at: '2021-06-11T00:36:13.015Z',
      updated_at: '2021-06-11T00:36:13.015Z',
      __v: 0
    },
    {
      groups: [],
      accessToken: null,
      _id: '60c32f6bb66ac2002c8fe5cd',
      email: 'test3@gmail.com',
      firstname: 'thomas',
      lastname: 'simoes',
      birthdate: '2000-01-01T00:00:00.000Z',
      avatar: 'avatar3',
      created_at: '2021-06-11T09:39:55.683Z',
      updated_at: '2021-06-11T09:39:55.683Z',
      __v: 0
    }
];
  admin: any;
  membersAdded!: [];
  constructor(private fb: FormBuilder, private modalService: NgbModal,private http: HttpClient) {}

  
  
  ngOnInit() {
    // get list of users (members)
    this.getUsersList();


    this.selectForm = this.fb.group({
      selectedMembers: []
  });

    this.createGroupForm = this.fb.group({
    name: [''],
    admin: [''],
    });
}

  createGroup(targetModal: any){
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
     });
     console.log("users array", this.membersAdded); 
   }

  onSubmit() {
    this.modalService.dismissAll();
    console.log("res:", this.createGroupForm.getRawValue(),this.selectForm.getRawValue());
   }
   
   clearListSelected() {
    this.selectForm.get('selectedMembers')?.patchValue([]);
  }

   // Fetching users data 
  getUsersList() {
    this.http
      .get<any>(environment.baseUrl+this.ADD_URL)
      .subscribe(response => {
        this.userList = response.map((o: { search_label: string; firstname: string; lastname: string; email: string; }) => {
          o.search_label =
            ` ${o.firstname}  ${o.lastname} ${o.email}
          `
          return o
        });
        console.log(this.userList);

      }, error => {
        console.log(error);
      });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();

    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);

    let isWordThere: boolean[] = [];

    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      let search = item['search_label'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word: any) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }


}

  






