import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = `${environment.baseUrl}/categories`;
  constructor(private http:HttpClient){}

  getAllCategories(): Observable<any>{
    return this.http.get<any>(this.categoriesUrl,{withCredentials:true})
  }
}
