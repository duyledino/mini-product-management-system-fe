import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthApi } from '../services/auth-api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthStore } from '../state/auth-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("access_token");
  const authApi = inject(AuthApi);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const addToken = (request: HttpRequest<any>, token: string | null) => {
    return token ? request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : request;
  };

  return next(addToken(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 Unauthorized and not already calling refresh endpoint
      if (error.status === 401 && !req.url.includes('/refresh')) {
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (refreshToken) {
          return authApi.refreshToken(refreshToken).pipe(
            catchError((refreshError) => {
              // Refresh failed - likely refresh token is also expired or invalid
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              authStore.currentUser.set(null);
              // toastr.error('Session expired. Please login again.');
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
            switchMap((response) => {
              // Successfully refreshed tokens
              const newAccessToken = response.data.accessToken;
              localStorage.setItem("access_token", newAccessToken);
              localStorage.setItem("refresh_token", response.data.refreshToken);
              
              // Retry the original request with the new access token
              // Any error here will now correctly bubble up to the component without triggering logout!
              return next(addToken(req, newAccessToken));
            })
          );
        } else {
          // No refresh token available, redirect to login
          localStorage.removeItem("access_token");
          router.navigate(['/login']);
        }
      }
      
      return throwError(() => error);
    })
  );
};
