import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproducts } from '../models/iproducts';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductAPI {

  constructor(private http:HttpClient)
   {
   }

      getAllProducts():Observable<Iproducts[]>{

      return this.http.get<Iproducts[]>(`${environment.baseUrl}/products`)
    }

    getProductById(prd:number):Observable<Iproducts>{

    return this.http.get<Iproducts>(`${environment.baseUrl}/products/${prd}`)
  }

  search(value:string):Observable<Iproducts[]>{
        
    return this.http.get<Iproducts[]>(`${environment.baseUrl}/products?product=${value}`)
  }

  getAllIds():Observable <number[]>{
return this.getAllProducts().pipe(map((pro)=>pro.map((pro2)=>pro2.id)))
}
}
