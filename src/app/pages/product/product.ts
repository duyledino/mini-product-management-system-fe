import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductItem } from '../../components/product-item/product-item';
import { ProductStore } from '../../core/state/product-store';
import { ToastrService } from 'ngx-toastr';
import { createProductRequest, ProductPublic } from '../../core/models/product/product';
import { AuthStore } from '../../core/state/auth-store';
import { ProductModal } from "../../components/product-modal/product-modal";

@Component({
  selector: 'app-product',
  imports: [ProductItem, ProductModal],
  standalone: true,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  private authStore = inject(AuthStore);
  public productStore = inject(ProductStore);
  private toastr = inject(ToastrService);
  readonly isLoading = this.productStore.isLoading;
  public isModalOpen = signal(false);
  public products: ProductPublic[]  = [];  
  ngOnInit(): void {
    this.productStore.loadProducts().subscribe({
      next: (response) => {
        console.log(this.products);
        this.products = response.data;
      },
      error: (error) => {
        console.log(error);
        this.productStore.loadProducts();
      }
    });
  }
handleSave(formData: FormData) {
    this.productStore.createProduct(formData).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.productStore.loadProducts().subscribe({
          next: (response) => {
            this.products = response.data;
            this.isModalOpen.set(false);
          },
          error: (error) => {
            console.log(error);
            this.toastr.error(error.error.message);
          }
        });
      },
      error: (error) => {
        console.log("error: ",error);
        this.toastr.error(error.error.error);
      }
    });
}
isAdminOrManager = computed(() => {
  const user = this.authStore.currentUser();
  const isManager = user?.roles.some((r: any) => r.toUpperCase() === 'MANAGER');
  const isAdmin = user?.roles.some((r: any) => r.toUpperCase() === 'ADMIN');
  return isManager || isAdmin;
});
}
