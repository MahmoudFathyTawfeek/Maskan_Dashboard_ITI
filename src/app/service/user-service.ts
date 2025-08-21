import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Iuser } from '../models/iuser';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class userService {
httpHeaders={}
  constructor(
    private http:HttpClient
  ) {

    this.httpHeaders={headers:new HttpHeaders({
     'Content-Type':'applicatin/json'
    })}

   }

   addNewUser(newUser:Iuser):Observable<Iuser>{
    return this.http.post<Iuser>(`${environment.baseUrl}/users`,newUser,this.httpHeaders)
   }
  getUsers(): Observable<any> {

    return this.http.get<any[]>(`${environment.baseUrl}/users/all`, { withCredentials: true });
  }
}
