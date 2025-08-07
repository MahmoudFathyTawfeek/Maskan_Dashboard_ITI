import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ilisting } from '../models/ilisting';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'http://localhost:3000/listings';

  constructor(private http: HttpClient) {}

  getListings(): Observable<Ilisting[]> {
    return this.http.get<Ilisting[]>(this.apiUrl);
  }

  getListingById(id: number): Observable<Ilisting> {
    return this.http.get<Ilisting>(`${this.apiUrl}/${id}`);
  }

  addListing(listing: Omit<Ilisting, 'id'>): Observable<Ilisting> {
    return this.http.post<Ilisting>(this.apiUrl, listing);
  }

  updateListing(listing: Ilisting): Observable<Ilisting> {
    return this.http.put<Ilisting>(`${this.apiUrl}/${listing.id}`, listing);
  }

  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
