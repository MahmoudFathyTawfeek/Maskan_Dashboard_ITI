import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmenitiesService {
  constructor(private http: HttpClient){}

  getAmenities()  {
    return this.http.get<any>( `${environment.baseUrl}/amenities`, { withCredentials: true });
  }
}
