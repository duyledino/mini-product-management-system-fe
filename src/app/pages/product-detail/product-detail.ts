import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductStore } from '../../core/state/product-store';
import { ToastrService } from 'ngx-toastr';
import { ProductDetail as ProductDetailModel, ProductVersion } from '../../core/models/product/product';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../core/state/auth-store';
import { ProductModal } from '../../components/product-modal/product-modal';
import { AddToCart } from "../../components/add-to-cart/add-to-cart";

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ProductModal, AddToCart],
  standalone:true,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productStore = inject(ProductStore);
  private toastr = inject(ToastrService);
  public productDetail= signal<ProductDetailModel|null>(null);
 public selectedVersion = signal<ProductVersion | null>(null);
 public authStore = inject(AuthStore);
 public isModalOpen = signal(false);
 stockQuantity = computed(()=>this.productStore.productDetail()?.stockQuantity);
  ngOnInit(): void {
    this.productStore.loadProductDetail(this.route.snapshot.params['id']).subscribe({
      next: (response) => {
        console.log("response: ",response);
        this.productDetail.set(response.data);
        this.selectVersion(response.data.productVersionList[0]);
      },
      error: (error) => {
        console.log("error: ",error);
        this.toastr.error(error.error.error);
      }
    });
  }
  openModal() {
    this.isModalOpen.set(true);
  }
  handleSave(formData: any) {    
    console.log("formData in product-detail: ",formData);
      this.productStore.updateProduct(this.productDetail()?.id!,formData).subscribe({
        next: (response) => {
          const current = this.productDetail();
        if(current){
          this.productDetail.set({...current, ...response.data});
        }
          this.toastr.success(response.message);
        },
        error: (error) => {
          console.log("error: ",error);
          this.toastr.error(error.error.error);
        }
      });
    this.isModalOpen.set(false);
  }
  selectVersion(version: ProductVersion|null) {
    if(version){
      this.selectedVersion.set(version);
    }
  }
  log(data: any): void {
    console.log('Template Debug:', data);
  }
  // Inside your ProductDetail class
isAdmin = computed(() => {
  const user = this.authStore.currentUser();
  // DEBUG: This will log every time the user state changes
  console.log('Checking Admin Status for:', user);
  
  if (!user || !user.roles) return false;
  
  // Use toUpperCase() to avoid case-sensitivity bugs
  return user.roles.some((r: any) => r.toUpperCase() === 'ADMIN');
});

isOwnerManager = computed(() => {
  const user = this.authStore.currentUser();
  const product = this.productDetail();
  
  if (!user || !product) return false;
  
  const isManager = user.roles.some((r: any) => r.toUpperCase() === 'MANAGER');
  const isOwner = user.userId === product.ownerId;
  
  return isManager && isOwner;
});
}
