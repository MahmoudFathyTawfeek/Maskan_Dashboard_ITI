
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ibooking } from '../models/ibooking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsUrl = 'http://localhost:3000/bookings';
  private unitsUrl = 'http://localhost:3000/units';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Ibooking[]> {
    return this.http.get<Ibooking[]>(this.bookingsUrl);
  }

  getUnits(): Observable<{id: number}[]> {
    return this.http.get<{id: number}[]>(this.unitsUrl);
  }
}
