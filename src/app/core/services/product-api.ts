import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createProductRequest, ProductDetail, ProductPublic, updateProductRequest, adminProduct, CreateVersionRequest } from '../models/product/product';
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
  updateProduct(id: string, productData: FormData){
    return this.http.put<ApiResponse<ProductPublic>>(this.baseUrl + '/' + id, productData);
  }
  deleteProduct(id: string){
    console.log("id: ",id);
    return this.http.delete<ApiResponse<string>>(this.baseUrl + '/' + id);
  }
  createProduct(productData: FormData){
    console.log("productData: ", productData);
    return this.http.post<ApiResponse<ProductPublic>>(this.baseUrl, productData);
  }
  createProductVersion(productId: string, request: CreateVersionRequest, userId: string, role: string) {
    console.log("create version: ", request);
    return this.http.post<ApiResponse<any>>(this.baseUrl + '/' + productId + '/versions', request, {
      headers: {
        'X-User-Id': userId,
        'X-Role': role
      }
    });
  }
  getAllProducts(){
    return this.http.get<ApiResponse<adminProduct[]>>(this.baseUrl+'/all-product');
  }
}
