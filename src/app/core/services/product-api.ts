import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createProductRequest, ProductDetail, ProductPublic, updateProductRequest } from '../models/product/product';
import { ApiResponse } from '../models/response/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/products';
  getProducts() {
    return this.http.get<ApiResponse<ProductPublic[]>>(this.baseUrl+'/public');
  }
  getDetailProduct(id: string){
    return this.http.get<ApiResponse<ProductDetail>>(this.baseUrl + '/public/' + id);
  }
  updateProduct(id: string, product: updateProductRequest){
    return this.http.put<ApiResponse<ProductPublic>>(this.baseUrl + '/' + id,product);
  }
  deleteProduct(id: string){
    console.log("id: ",id);
    return this.http.delete<ApiResponse<string>>(this.baseUrl + '/' + id);
  }
  createProduct(product: createProductRequest){
    console.log("product: ",product);
    return this.http.post<ApiResponse<ProductPublic>>(this.baseUrl,product);
  }
}
