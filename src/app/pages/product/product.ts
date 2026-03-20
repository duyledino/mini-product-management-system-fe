import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductItem } from '../../components/product-item/product-item';
import { ProductStore } from '../../core/state/product-store';
import { ToastrService } from 'ngx-toastr';
import { ProductPublic } from '../../core/models/product/product';
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
  // private productService = inject(this.productService);
  // private product:ProductItem[] = 
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
        // this.toastr.error(error.error.message);
      }

    });
  }
handleSave(formData: any) {
  const { public: isPublic, ...rest } = formData;
  const payload = {
    ...rest,
    isPublic: isPublic ?? true
  };
  console.log("formData: ",formData,"payload here: ",payload);
  this.productStore.createProduct(payload).subscribe({
    next: (response) => {
      this.toastr.success(response.message);
      this.productStore.loadProducts().subscribe({
        next: (response) => {
          this.products = response.data;
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
  this.isModalOpen.set(false);
}
isAdminOrManager = computed(() => {
  const user = this.authStore.currentUser();
  const isManager = user?.roles.some((r: any) => r.toUpperCase() === 'MANAGER');
  const isAdmin = user?.roles.some((r: any) => r.toUpperCase() === 'ADMIN');
  return isManager || isAdmin;
});
}
