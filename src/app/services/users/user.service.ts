import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { TimelineService } from '../services.utils/timeline/timeline-service.service';
import { Timer } from '../../models/timer/Timer';
import { User } from 'src/app/models/user/User';

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
  RESET_PASSWORD = '/resetPassword';
  NEW_PASSWORD = '/new-password';
  VALID_PASSWORD_TOKEN = '/valid-password-token';


  constructor(private http: HttpClient, private timelineService: TimelineService) { }


  public findAll(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.hostname}${this.ADD_URL}`, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  async CurrentUser() {
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
    return this.http.post(environment.baseUrl + this.ADD_URL + this.RESET_PASSWORD, body);
  }

  newPassword(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.ADD_URL + this.NEW_PASSWORD, data);
  }

  ValidPasswordToken(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.ADD_URL + this.VALID_PASSWORD_TOKEN, data);
  }

  public timeline(timers: Array<Timer>, timestamp: number) {
    return (this.timelineService.apply(timers, timestamp));
  }

  public update(user: User) {
    return this.http.put(`${this.hostname}/users/${user._id}`, user, {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

  getUser(id: any): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/users/${id}`, { 
      headers: { 
        'Authorization': `${localStorage.getItem('token')}` 
      } 
    });
  }

}
