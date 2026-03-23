import { Component, inject, Input } from '@angular/core';
import { CartStore } from '../../core/state/cart-store';
import { ToastrService } from 'ngx-toastr';
import { ProductDetail } from '../../core/models/product/product';

@Component({
  selector: 'app-add-to-cart',
  imports: [],
  standalone: true,
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.css',
})
export class AddToCart {
  @Input() product!: ProductDetail;
  private cartStore = inject(CartStore);
  private toastService = inject(ToastrService);
  clickAddToCart() {
    this.cartStore.addToCart(this.product.id, 1).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.success(response.message||'Product added to cart successfully');
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error.error||'Failed to add product to cart');
      },
    });
  }
}
