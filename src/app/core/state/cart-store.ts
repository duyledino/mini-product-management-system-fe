import { computed, inject, Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '../models/cart/cart';
import { single, tap } from 'rxjs';
import { CartApi } from '../services/cart-api';
import { ProductStore } from './product-store';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  public cart = signal<Cart|null>(null);
  public cartItem = signal<CartItem|null>(null);
  private cartApi = inject(CartApi);
  private productStore = inject(ProductStore);
  private toastr = inject(ToastrService);  
  isLoading = signal<boolean>(false);
  loadCart(){
    this.isLoading.set(true);
    return this.cartApi.getCart().pipe(tap({
      next: (response) => {
        this.cart.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      },
    }));
  }

  removeFromCart(cartItemId: string){
    this.isLoading.set(true);
    return this.cartApi.removeFromCart(cartItemId).pipe(tap({
      next: (response) => {
        this.cartItem.set(response.data);
        this.cart.update((cart) => {
          if (!cart) return null;
          return {
            ...cart,
            items: cart.items.filter((item) => item.cartItemId !== cartItemId),
          };
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      },
    }));
  }

  addToCart(productId: string, quantity: number){
    this.isLoading.set(true);
    return this.cartApi.addToCart(productId, quantity).pipe(tap({
      next: (response) => {
        this.cartItem.set(response.data);
        this.cart.update((cart) => {
          if (!cart) return null;
          const existingItem = cart.items.find(item => item.productId === productId);
          if (existingItem) {
            return {
              ...cart,
              items: cart.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            ...cart,
            items: [...cart.items, response.data],
          };
        });
        this.productStore.productDetail.update((pd)=>{
          if(!pd) return null;
          return {
            ...pd,
            stockQuantity: pd!.stockQuantity - quantity,
          }
        })
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.error);
        this.isLoading.set(false);
      },
    }));
  }

}
