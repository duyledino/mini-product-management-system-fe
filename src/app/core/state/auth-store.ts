import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthApi } from '../services/auth-api';
import { ToastrService } from 'ngx-toastr';
import { ErrorResponse } from '../models/response/error-response';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private authApi = inject(AuthApi);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // --- 1. STATE (Like Redux initial state) ---
  currentUser = signal<any | null>(null);
  isLoading = signal<boolean>(false);

  // --- 2. SELECTORS (Like Redux selectors) ---
  // Computed signals automatically update when the state changes
  isAuthenticated = computed(() => this.currentUser() !== null);

  // --- 3. ACTIONS (Like Redux Thunks/Reducers) ---
  login(credentials: any) {
    this.isLoading.set(true); // Turn on loading spinner

    this.authApi.login(credentials).subscribe({
      next: (response) => {
        // Update the state with the user data!
        console.log(response);
        console.log('Login response: ', response.data);
        this.currentUser.set(response.data);
        this.isLoading.set(false);
        this.toastr.success(response.message || 'Login successful');
        localStorage.setItem('access_token', response.data.accessToken);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.log('Login error: ', error.error);
        const errorBody: ErrorResponse = error.error;
        this.isLoading.set(false);
        this.toastr.error(errorBody.error || 'Login failed');
      }
    });
  }

  register(credentials: any) {
    this.isLoading.set(true); // Turn on loading spinner

    this.authApi.register(credentials).subscribe({
      next: (response) => {
        // Update the state with the user data!
        console.log(response);
        console.log('Register response: ', response.data);
        this.currentUser.set(response.data);
        this.isLoading.set(false);
        this.toastr.success(response.message || 'Register successful');
        localStorage.setItem('access_token', response.data.accessToken);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.log('Register error: ', error.error);
        const errorBody: ErrorResponse = error.error;
        this.isLoading.set(false);
        this.toastr.error(errorBody.error || 'Register failed');
      }
    });
  }

  logout() {
    this.currentUser.set(null);
  }
}