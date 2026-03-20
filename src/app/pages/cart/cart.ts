import { Component, computed, inject, OnInit } from '@angular/core';
import { CartStore } from '../../core/state/cart-store';
import { ToastrService } from 'ngx-toastr';
import {Cart as CartModel} from '../../core/models/cart/cart';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartStore = inject(CartStore);
  private toast = inject(ToastrService);
  readonly cart = this.cartStore.cart;
  readonly cartItem = this.cartStore.cartItem;
  readonly isLoading = this.cartStore.isLoading;
  ngOnInit(): void {
    this.cartStore.loadCart().subscribe({
      next: () => {
        console.log(this.cart());
      },
      error: (error) => {
        this.toast.error(error.message);
        console.error(error);
      }
    });
  }

  totalAmount = computed(() => {
    console.log(this.cart());
    return this.cartStore.cart()?.items.reduce((total, item) => total + item.totalPrice, 0) || 0;
  });

  removeFromCart(cartItemId: string){
    this.cartStore.removeFromCart(cartItemId).subscribe({
      next: () => {
        console.log(this.cartItem());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addToCart(productId: string, quantity: number){
    this.cartStore.addToCart(productId, quantity).subscribe({
      next: () => {
        console.log(this.cartItem());
        this.cartStore.loadCart().subscribe();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


}
