import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthApi } from '../services/auth-api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("access_token");
  const authStore = inject(AuthApi);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  if(req.url.includes('cloudinary.com')){
    return next(req);
  }
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.log("error: ",error);
      if (error.status === 401) {
        // localStorage.removeItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if(refreshToken){
          authStore.refreshToken(refreshToken).subscribe({
            next: (response) => {
              // toastr.success(response.message || 'Token refreshed successfully');
              localStorage.setItem("access_token", response.data.accessToken);
              localStorage.setItem("refresh_token", response.data.refreshToken);
            },
            error: (error) => {
              console.log(error);
              toastr.error(error.error.error);
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              router.navigate(['/login']);
            }
          });
        }
        localStorage.removeItem("refresh_token");
        
      }
      return throwError(() => error);
    })
  );
};
