import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductPublic } from '../models/product/product';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/products';
  getProducts() {
    return this.http.get<ProductPublic[]>(this.baseUrl);
  }
}
