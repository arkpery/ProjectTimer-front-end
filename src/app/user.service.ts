import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/User';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  hostname: string = "http://localhost:7777";





  private users: User[] = [];
  userSubject = new Subject<User[]>();

  LOGIN_URL = '/users/login';
  LOGOUT_URL = '/users/logout';
  ADD_URL = '/users';
  RESET_PASSWORD='/resetPassword';
  NEW_PASSWORD='/new-password';
  VALID_PASSWORD_TOKEN = '/valid-password-token';
  

  constructor(private http: HttpClient) { }


  async CurrentUser(){
    const token = window.localStorage.getItem("token");

    return this.http.get<User>(`${this.hostname}/users/me`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    }).toPromise();
  }
  
  emitUsers() {
    this.userSubject.next(this.users.slice());
  }

  addUser(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + this.ADD_URL, user);
  }

  login(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.LOGIN_URL, data);
  }

  requestReset(body: any): Observable<any> {
    return this.http.post(environment.baseUrl+this.ADD_URL+this.RESET_PASSWORD, body);
  }

  newPassword(data: any): Observable<any> {
    return this.http.post(environment.baseUrl+this.ADD_URL+this.NEW_PASSWORD, data);
  }

  ValidPasswordToken(data: any): Observable<any> {
    return this.http.post(environment.baseUrl+this.ADD_URL+this.VALID_PASSWORD_TOKEN, data);
  }

}
