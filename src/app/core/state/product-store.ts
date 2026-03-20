import { inject, Injectable, signal } from '@angular/core';
import { ProductApi } from '../services/product-api';
import { ProductItem } from '../../components/product-item/product-item';
import { tap } from 'rxjs';
import { createProductRequest, ProductDetail, ProductPublic, updateProductRequest } from '../models/product/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private productApi = inject(ProductApi);
  public products= signal<ProductPublic[]>([]);
  public isLoading = signal<boolean>(false);
  public productDetail = signal<ProductDetail | null>(null);
  public isLoadingDetail = signal<boolean>(false);
  public isLoadingUpdate = signal<boolean>(false);
  public isLoadingCreate = signal<boolean>(false);
  loadProductDetail(id: string){
    this.isLoadingDetail.set(true);
    return this.productApi.getDetailProduct(id).pipe(tap({
      next: (response) => {
        this.productDetail.set(response.data);
        this.isLoadingDetail.set(false);
      },
      error: (error) => {
        this.isLoadingDetail.set(false);
      }
    }));
  }
  loadProducts(){
    this.isLoading.set(true);
    return this.productApi.getProducts().pipe(tap({
      next: (response) => {
        this.products.set(response.data); // Updates the Store's signal
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
      }
    }));
  }
  updateProduct(id: string, product: updateProductRequest){
    this.isLoadingUpdate.set(true);
    return this.productApi.updateProduct(id,product).pipe(tap({
      next: (response) => {
        this.isLoadingUpdate.set(false);
      },
      error: (error) => {
        this.isLoadingUpdate.set(false);
      }
    }));
  }
  createProduct(product: createProductRequest){
    console.log("product: ",product);
    this.isLoadingCreate.set(true);
    return this.productApi.createProduct(product).pipe(tap({
      next: (response) => {
        this.isLoadingCreate.set(false);
      },
      error: (error) => {
        this.isLoadingCreate.set(false);
      }
    }));
  }
}
