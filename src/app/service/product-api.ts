import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iunit } from '../models/iunit';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private baseUrl = `${environment.baseUrl}/amenities`;

  constructor(private http: HttpClient) {}

  getAllAmenities(): Observable<Iunit[]> {   
    return this.http.get<Iunit[]>(this.baseUrl);
  }

  addAmenity(amenity: Iunit): Observable<Iunit> {
    return this.http.post<Iunit>(this.baseUrl, amenity);
  }

  updateAmenity(id: string, amenity: Partial<Iunit>): Observable<Iunit> {
    return this.http.patch<Iunit>(`${this.baseUrl}/${id}`, amenity);
  }

  deleteAmenity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
