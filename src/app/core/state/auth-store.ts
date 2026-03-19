import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthApi } from '../services/auth-api';
import { ToastrService } from 'ngx-toastr';
import { ErrorResponse } from '../models/response/error-response';
import { catchError, of, tap } from 'rxjs';
import { ProfileApi } from '../services/profile-api';
import { Profile } from '../models/user/user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private authApi = inject(AuthApi);
  private profileApi = inject(ProfileApi);
  private toastr = inject(ToastrService);

  // --- 1. STATE (Like Redux initial state) ---
  currentUser = signal<Profile | null>(null);
  isLoading = signal<boolean>(false);

  // --- 2. SELECTORS (Like Redux selectors) ---
  // Computed signals automatically update when the state changes
  isAuthenticated = computed(() => this.currentUser() !== null);

  loadUserProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) return of(null); 

    this.isLoading.set(true);
    return this.profileApi.getProfile().pipe(
      tap((response) => {
        this.currentUser.set(response.data);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.logout(); 
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  // --- 3. ACTIONS (Like Redux Thunks/Reducers) ---
  login(credentials: any) {
    this.isLoading.set(true); // Turn on loading spinner

    return this.authApi.login(credentials).pipe(tap(
      {
        next: (response) => {
          // Update the state with the user data!
          console.log(response);
          console.log('Login response: ', response.data);
          this.isLoading.set(false);
          this.toastr.success(response.message || 'Login successful');
          localStorage.setItem('access_token', response.data.accessToken);
          this.profileApi.getProfile().subscribe({
            next: (response) => {
              console.log('Profile response: ',response);
              this.currentUser.set(response.data);
            },
            error: (error: any) => {
              console.log('Profile error: ', error.error);
              const errorBody: ErrorResponse = error.error;
              this.isLoading.set(false);
              this.toastr.error(errorBody.error || 'Profile failed');
            }
          });
        },
        error: (error: any) => {
          console.log('Login error: ', error.error);
          const errorBody: ErrorResponse = error.error;
          this.isLoading.set(false);
          this.toastr.error(errorBody.error || 'Login failed');
        }
      }
    ));
  }

  register(credentials: any) {
    this.isLoading.set(true); // Turn on loading spinner

    return this.authApi.register(credentials).pipe(tap({
      next: (response) => {
        // Update the state with the user data!
        console.log(response);
        console.log('Register response: ', response.data);
        this.isLoading.set(false);
        this.toastr.success(response.message || 'Register successful');
        localStorage.setItem('access_token', response.data.accessToken);
        this.profileApi.getProfile().subscribe({
          next: (response) => {
            console.log('Profile response: ',response);
            this.currentUser.set(response.data);
          },
          error: (error: any) => {
            console.log('Profile error: ', error.error);
            const errorBody: ErrorResponse = error.error;
            this.isLoading.set(false);
            this.toastr.error(errorBody.error || 'Profile failed');
          }
        });
      },
      error: (error: any) => {
        console.log('Register error: ', error.error);
        const errorBody: ErrorResponse = error.error;
        this.isLoading.set(false);
        this.toastr.error(errorBody.error || 'Register failed');
      }
    }));
  }

  logout() {
    this.currentUser.set(null);
  }
}