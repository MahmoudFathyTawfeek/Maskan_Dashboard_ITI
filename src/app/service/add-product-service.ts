import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iunit } from '../models/iunit';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddUnitService {
  private httpHeaders;

  constructor(private http: HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'  
      })
    };
  }

  addUnit(newUnit: Iunit): Observable<Iunit> {
    return this.http.post<Iunit>(`${environment.baseUrl}/units`, newUnit, this.httpHeaders);
  }
}
