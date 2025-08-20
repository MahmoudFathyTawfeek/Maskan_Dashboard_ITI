import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IListing } from '../models/ilisting';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = `${environment.baseUrl}/listings`;

  constructor(private http: HttpClient) {}

  getListings(): Observable<IListing[]> {
    console.log('Fetching listings from:', this.apiUrl);
    return this.http.get<IListing[]>(this.apiUrl).pipe(
      tap(data => console.log('Received listings:', data)),
      catchError(this.handleError)
    );
  }
   deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => errorMessage);
  }

  // ...rest of the service methods...
}