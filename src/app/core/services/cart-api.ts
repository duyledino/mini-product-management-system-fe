import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/response/api-response';
import { Cart, CartItem } from '../models/cart/cart';

@Injectable({
  providedIn: 'root',
})
export class CartApi {
  private baseUrl = 'http://localhost:8080/api/cart';
  private http = inject(HttpClient);
  
  addToCart(productId: string, quantity: number) {
    return this.http.post<ApiResponse<CartItem>>(`${this.baseUrl}/items`, { productId, quantity });
  }

  getCart() {
    return this.http.get<ApiResponse<Cart>>(`${this.baseUrl}`);
  }

  removeFromCart(itemId: string) {
    return this.http.delete<ApiResponse<CartItem>>(`${this.baseUrl}/items/${itemId}`);
  }

  reduceFromCart(productId: string,quantity: number) {
    return this.http.post<ApiResponse<CartItem>>(`${this.baseUrl}/items/reduce`, { productId, quantity });
  }
}
