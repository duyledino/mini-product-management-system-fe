import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/state/auth-store';
import { CartStore } from '../../core/state/cart-store';
import { ToastrService } from 'ngx-toastr';

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
  router = inject(Router);
  toastr = inject(ToastrService);
  readonly cartCount = computed(() => {
    const items = this.cartStore.cart()?.items || [];
    return items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  });
  readonly isAdmin = computed(() => {
    const user = this.authStore.currentUser();
    return user?.roles.some((r: any) => r.toUpperCase() === 'ADMIN') ?? false;
  });
  readonly isAuthenticated = computed(() => {
    return this.authStore.isAuthenticated();
  });

  logout(){
    this.authStore.logout().subscribe({
      next: (response) => {
        console.log("response: ",response);
        this.toastr.success(response.message || 'Logout successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log("error: ",error);
        this.toastr.error(error.error.message || 'Logout failed');
      }
    });
  }
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
