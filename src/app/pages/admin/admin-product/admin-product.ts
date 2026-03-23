import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductStore } from '../../../core/state/product-store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { createProductRequest } from '../../../core/models/product/product';
import { CloudinaryApi } from '../../../core/services/cloudinary-api';
import { AuthStore } from '../../../core/state/auth-store';

@Component({
  selector: 'app-admin-product',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.css',
})
export class AdminProduct implements OnInit {
  private productStore = inject(ProductStore);
  public authStore = inject(AuthStore);
  public adminProducts = this.productStore.adminProducts;
  public isLoadingAdminProducts = this.productStore.isLoadingAdminProducts;
  private toastr = inject(ToastrService);
  private cloudinaryApi = inject(CloudinaryApi);

  // UI State
  public expandedProducts: Set<string> = new Set();
  
  // Modals state
  public isProductModalOpen = false;
  public isVersionModalOpen = false;
  
  public modalMode: 'CREATE' | 'UPDATE' = 'CREATE';
  
  // Forms state
  public productForm: createProductRequest = { name: '', description: '', price: 0, stockQuantity: 0, isPublic: false, imageUrl: '' };
  public versionForm: any = { versionNumber: 0, name: '', description: '', price: 0 };
  
  // Image handling
  public urlPreview: string | null = null;
  public isUploading = signal(false);
  private selectedFile: File | null = null;
  private originalImageUrl: string | null = null;

  public currentEditingProductId: string | null = null;
  public currentEditingVersionNumber: number | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productStore.loadAdminProducts().subscribe({
      next: (response) => {
        this.adminProducts.set(response.data);
        console.log('Loaded admin products:', response);
      },
      error: (error) => console.log(error)
    });
  }

  toggleVersions(productId: string) {
    if (this.expandedProducts.has(productId)) {
      this.expandedProducts.delete(productId);
    } else {
      this.expandedProducts.add(productId);
    }
  }

  isExpanded(productId: string): boolean {
    return this.expandedProducts.has(productId);
  }

  onFileSelected(file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toastr.error('File is not an image');
      return;
    }
    if(file.size > 1024 * 1024 * 10) {
      this.toastr.error('File is too large');
      return;
    }
    this.selectedFile = file;
    this.urlPreview = URL.createObjectURL(file);
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const lastPart = parts.pop() || '';
    const folder = parts.pop() || '';
    const filename = lastPart.split('.')[0];
    return `${folder}/${filename}`;
  }

  
  openCreateProduct() {
    this.modalMode = 'CREATE';
    this.productForm = { name: '', description: '', price: 0, stockQuantity: 0, isPublic: false, imageUrl: '' };
    this.urlPreview = null;
    this.selectedFile = null;
    this.originalImageUrl = null;
    this.isProductModalOpen = true;
  }

  openUpdateProduct(product: any) {
    this.modalMode = 'UPDATE';
    this.currentEditingProductId = product.id;
    this.productForm = { 
      name: product.name, 
      description: product.description, 
      price: product.price, 
      stockQuantity: product.stockQuantity, 
      isPublic: product.public,
      imageUrl: product.imageUrl || '' 
    };
    this.urlPreview = product.imageUrl || null;
    this.selectedFile = null;
    this.originalImageUrl = product.imageUrl || null;
    this.isProductModalOpen = true;
  }

  closeProductModal() {
    this.isProductModalOpen = false;
    this.currentEditingProductId = null;
    this.selectedFile = null;
    this.urlPreview = null;
  }

  saveProduct() {
    if (this.selectedFile) {
      this.isUploading.set(true);

      const doUpload = () => {
        this.cloudinaryApi.uploadImage(this.selectedFile!).subscribe({
          next: (response: any) => {
            this.productForm.imageUrl = response.secure_url;
            this.isUploading.set(false);
            this.submitProductForm();
          },
          error: (error) => {
            this.isUploading.set(false);
            this.toastr.error('Failed to upload image. Form not saved.');
          }
        });
      };

      if (this.modalMode === 'UPDATE' && this.originalImageUrl) {
        const oldPublicId = this.extractPublicId(this.originalImageUrl);
        this.cloudinaryApi.destroyImage(oldPublicId).subscribe({
          next: () => doUpload(),
          error: (err) => {
            console.log('Error destroying old image', err);
            doUpload(); // continue upload even if destroy fails
          }
        });
      } else {
        doUpload();
      }
    } else {
      this.submitProductForm();
    }
  }

  private submitProductForm() {
    const payload: createProductRequest = {
      name: this.productForm.name,
      description: this.productForm.description,
      price: this.productForm.price,
      stockQuantity: this.productForm.stockQuantity,
      isPublic: this.productForm.isPublic,
      imageUrl: this.productForm.imageUrl
    };

    if (this.modalMode === 'CREATE') {
      this.productStore.createProduct(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Product created successfully');
          this.loadProducts();
          this.closeProductModal();
        },
        error: (error) => {
          console.log(error)
          this.toastr.error(error.message || 'Failed to create product');
        }
      });
    } else {
      this.productStore.updateProduct(this.currentEditingProductId!, payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Product updated successfully');
          this.loadProducts();
          this.closeProductModal();
        },
        error: (error) => {
          console.log(error)
          this.toastr.error(error.message || 'Failed to update product');
        }
      });
    }
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('API CALL: Delete Product', productId);
      this.productStore.deleteProduct(productId).subscribe({
        next: (response) => {
          this.toastr.success(response.message ||'Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.log(error)
          this.toastr.error(error.message ||'Failed to delete product');
        }
      });
    }
  }

  // --- Version CRUD ---

  openCreateVersion(product: any) {
    this.modalMode = 'CREATE';
    this.currentEditingProductId = product.id;
    this.versionForm = { versionNumber: (product.currentVersion || 0) + 1, name: '', description: '', price: product.price };
    this.isVersionModalOpen = true;
  }

  openUpdateVersion(product: any, version: any) {
    this.modalMode = 'UPDATE';
    this.currentEditingProductId = product.id;
    this.currentEditingVersionNumber = version.versionNumber || version.currentVersion;
    this.versionForm = { ...version };
    this.isVersionModalOpen = true;
  }

  closeVersionModal() {
    this.isVersionModalOpen = false;
    this.currentEditingProductId = null;
    this.currentEditingVersionNumber = null;
  }

  saveVersion() {
    const user = this.authStore.currentUser();
    const userId = user?.userId || '';
    const role = String(user?.roles?.[0] || '');

    if (this.modalMode === 'CREATE') {
      const requestPayload = {
        name: this.versionForm.name,
        description: this.versionForm.description,
        price: this.versionForm.price
      };

      this.productStore.createProductVersion(this.currentEditingProductId!, requestPayload, userId, role).subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Version created successfully');
          this.loadProducts();
          this.closeVersionModal();
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error.error?.message || 'Failed to create product version');
        }
      });
    } else {
      console.log('API CALL: Update Version for Product [Not Implemented on Backend YET]', this.currentEditingProductId, 'Version:', this.currentEditingVersionNumber, this.versionForm);
      this.toastr.warning('Update version is not specified on backend yet');
      this.closeVersionModal();
    }
  }
}

