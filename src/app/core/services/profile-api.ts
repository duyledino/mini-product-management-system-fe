import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profile, UpdateProfileRequest } from '../models/user/user';
import { ApiResponse } from '../models/response/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users/me';
  getProfile() {
    return this.http.get<ApiResponse<Profile>>(this.baseUrl);
  } 

  updateProfile(profile: UpdateProfileRequest){
    return this.http.put<ApiResponse<Profile>>(this.baseUrl, profile);
  }

  // updatePassword(password: string){
  //   return this.http.put<ApiResponse<Profile>>(this.baseUrl + '/password', { password });
  // }
}
