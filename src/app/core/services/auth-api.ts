import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/response/api-response';
import { LoginResponse } from '../models/auth/login-response';
import { RegisterResponse } from '../models/auth/register_response';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  register(user: any) {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.API_URL}/register`, user);
  }

  login(user: any) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, user);
  }

  refreshToken(refreshToken: string){
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/refresh`, {refreshToken});
  }
}
