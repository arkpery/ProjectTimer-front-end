import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  hostname: string = "http://localhost:7777";


  constructor(private http : HttpClient) { }

  async CurrentUser(){
    const token = window.localStorage.getItem("token");

    return this.http.get<User>(`${this.hostname}/users/me`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    }).toPromise();
  }

}
