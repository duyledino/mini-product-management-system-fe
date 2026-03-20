import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profile } from '../models/user/user';
import { ApiResponse } from '../models/response/api-response';

@Injectable({
  providedIn: 'root',
})
export class AdminApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users';

  getAllUsers() {
    return this.http.get<ApiResponse<Profile[]>>(this.baseUrl);
  }

  assignRole(userId: string, newRole: string) {
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/${userId}/role`,
      null,
      { params: { newRole } }
    );
  }

  deactivateUser(userId: string) {
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/${userId}/deactivate`,
      null
    );
  }
}
