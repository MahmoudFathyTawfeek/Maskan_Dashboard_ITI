
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ibooking } from '../models/ibooking';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsUrl = `${environment.baseUrl}/bookings/all`;
  private unitsUrl = `${environment.baseUrl}/units`;

  constructor(private http: HttpClient) {}

  getBookings(): Observable<any> {
    return this.http.get<any>(this.bookingsUrl,{withCredentials:true});
  }

  getUnits(): Observable<{id: number}[]> {
    return this.http.get<{id: number}[]>(this.unitsUrl);
  }
}
