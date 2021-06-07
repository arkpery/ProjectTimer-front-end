import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  userSubject = new Subject<User[]>();

  LOGIN_URL = '/users/login';
  LOGOUT_URL = '/users/logout';
  ADD_URL = '/users';

  constructor(private http: HttpClient) { }

  emitUsers() {
    this.userSubject.next(this.users.slice());
  }

  addUser(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + this.ADD_URL, user);
  }

  login(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.LOGIN_URL, data);
  }
}
