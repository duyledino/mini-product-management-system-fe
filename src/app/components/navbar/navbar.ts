import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/state/auth-store';
import { CartStore } from '../../core/state/cart-store';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authStore = inject(AuthStore);
  cartStore = inject(CartStore);
  readonly cartCount = computed(() => {
    const items = this.cartStore.cart()?.items || [];
    return items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  });
  readonly isAdmin = computed(() => {
    const user = this.authStore.currentUser();
    return user?.roles.some((r: any) => r.toUpperCase() === 'ADMIN') ?? false;
  });
  ngOnInit(): void {
    this.cartStore.loadCart().subscribe({
      next: (response) => {
        console.log("response: ",response);
      },
      error: (error) => {
        console.log("error: ",error);
      }
    });
  }
}
