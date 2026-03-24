import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileStore } from '../../core/state/profile-store';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from "@angular/common";

@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgClass,CommonModule],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  public profileStore = inject(ProfileStore);
  private toast = inject(ToastrService);
  public isUploading = signal(false);
  urlPreview:string|null = null;
  editName = '';
  editAvatar = '';
  editAge = 0;
  onFileSelected(file: File){
    console.log(file);
    this.urlPreview = URL.createObjectURL(file);
    if(!file.type.startsWith('image/')){
      this.toast.error('File is not an image');
      return;
    }
    if(file.size > 1024 * 1024 * 10) {
      this.toast.error('File is too large');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('avatar', this.profileStore.profile()?.avatar || '')
    formData.append('name', this.editName.trim().length > 0 ? this.editName : this.profileStore.profile()?.name!);
    formData.append('age', (this.editAge > 0 ? this.editAge : this.profileStore.profile()?.age!).toString());

    this.isUploading.set(true);
    this.profileStore.updateProfile(formData).subscribe({
      next: (updateResponse) => {
        this.isUploading.set(false);
        this.toast.success(updateResponse.message || 'Profile updated successfully');
        this.profileStore.loadProfile().subscribe();
        this.urlPreview = null;
      },
      error: (error) => {
        this.isUploading.set(false);
        this.toast.error(error.error?.message || 'Failed to update profile');
      }
    });
  }

  ngOnInit(): void {
    this.profileStore.loadProfile().subscribe({
      next: (response) => {
        console.log(response.data);
        this.profileStore.profile.set(response.data);
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error(error);
        this.profileStore.profile.set(null);
        this.profileStore.loadProfile();
        // this.toast.error(error.message);
      }
    });
  }

  private populateForm(profile: any) {
    this.editName = profile.name || '';
    this.editAvatar = profile.avatar || '';
    this.editAge = profile.age || 0;
  }

  onUpdateProfile() {
    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('age', this.editAge.toString());
    // Note: No file appended here if only updating text fields
    
    this.profileStore.updateProfile(formData).subscribe({
      next: (response) => {
        this.toast.success(response.message || 'Profile updated successfully');
      },
      error: (error) => {
        this.toast.error(error.error?.message || 'Failed to update profile');
      }
    });
  }
}
