import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductItem } from '../../components/product-item/product-item';
import { ProductStore } from '../../core/state/product-store';
import { ToastrService } from 'ngx-toastr';
import { createProductRequest, ProductPublic } from '../../core/models/product/product';
import { AuthStore } from '../../core/state/auth-store';
import { ProductModal } from "../../components/product-modal/product-modal";
import { CloudinaryApi } from '../../core/services/cloudinary-api';

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
  private cloudinaryApi = inject(CloudinaryApi);
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
  const { public: isPublic, file, originalImageUrl, ...rest } = formData;
  const payload: createProductRequest = {
    ...rest,
    isPublic: isPublic ?? true,
    imageUrl: ''
  };

  const submitProductForm = () => {
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
  };

  if (file) {
    this.toastr.info('Uploading product image...', '', { timeOut: 2000 });
    this.cloudinaryApi.uploadImage(file).subscribe({
      next: (response: any) => {
        payload.imageUrl = response.secure_url;
        submitProductForm();
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error('Failed to upload image. Product not created.');
        this.isModalOpen.set(false);
      }
    });
  } else {
    submitProductForm();
  }
}
isAdminOrManager = computed(() => {
  const user = this.authStore.currentUser();
  const isManager = user?.roles.some((r: any) => r.toUpperCase() === 'MANAGER');
  const isAdmin = user?.roles.some((r: any) => r.toUpperCase() === 'ADMIN');
  return isManager || isAdmin;
});
}
