import { inject, Injectable } from '@angular/core';
import { ProfileApi } from '../services/profile-api';
import { tap } from 'rxjs';
import { Profile as ProfileModel, UpdateProfileRequest } from '../models/user/user';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private profileApi = inject(ProfileApi);
  public profile = signal<ProfileModel | null>(null);
  public isLoading = signal<boolean>(false);

  loadProfile() {
    this.isLoading.set(true);
    return this.profileApi.getProfile().pipe(
      tap({
        next: (response) => {
          this.profile.set(response.data);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.error(error);
          this.isLoading.set(false);
        }
      })
    );
  }

  updateProfile(request: FormData) {
    this.isLoading.set(true);
    return this.profileApi.updateProfile(request).pipe(
      tap({
        next: (response) => {
          this.profile.set(response.data);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.error(error);
          this.isLoading.set(false);
        }
      })
    );
  }
}
