import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  public findAll(){
    return this.http.get("/projects", {
      headers: {
        "Authorization": `${window.localStorage.getItem("token")}`
      }
    });
  }

}
