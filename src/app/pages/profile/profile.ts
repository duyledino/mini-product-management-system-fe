import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileStore } from '../../core/state/profile-store';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CloudinaryApi } from '../../core/services/cloudinary-api';
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
  private cloudinaryApi = inject(CloudinaryApi);
  public isUploading = signal(false);
  urlPreview:string|null = null;
  editName = '';
  editAvatar = '';
  editAge = 0;

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const lastPart = parts.pop() || '';
    const folder = parts.pop() || '';
    const filename = lastPart.split('.')[0];
    return `${folder}/${filename}`;
  }

  onFileSelected(file: File){
    console.log(file);
    this.urlPreview = URL.createObjectURL(file);
    this.isUploading.set(true);
    if(!file.type.startsWith('image/')){
      this.toast.error('File is not an image');
      this.isUploading.set(false);
      return;
    }
    if(file.size > 1024 * 1024 * 10) {
      this.toast.error('File is too large');
      this.isUploading.set(false);
      return;
    }
    const doUpload = () => {
      this.cloudinaryApi.uploadImage(file).subscribe({
        next: (response: any) => {
          this.isUploading.set(false);
          this.editAvatar = response.secure_url;
          this.urlPreview = null;
          this.profileStore.updateProfile({
            name: this.editName.trim().length > 0 ? this.editName : this.profileStore.profile()?.name!,
            avatar: this.editAvatar.trim().length > 0 ? response.secure_url : this.profileStore.profile()?.avatar!,
            age: this.editAge.toString().trim().length > 0 ? this.editAge : this.profileStore.profile()?.age!,
          }).subscribe({
            next: (updateResponse) => {
              this.toast.success(updateResponse.message || 'Profile updated successfully');
              this.profileStore.loadProfile().subscribe();
            },
            error: (error) => {
              this.toast.error(error.error?.message || 'Failed to update profile');
            }
          });
        },
        error: (error) => {
          this.isUploading.set(false);
          this.toast.error(error.error?.message || 'Failed to upload image');
        }
      });
    };

    const currentAvatar = this.profileStore.profile()?.avatar;
    if (currentAvatar && currentAvatar.includes('cloudinary.com')) {
      const oldPublicId = this.extractPublicId(currentAvatar);
      this.cloudinaryApi.destroyImage(oldPublicId).subscribe({
        next: () => doUpload(),
        error: (err) => {
          console.log('Error destroying old avatar', err);
          doUpload(); // continue fallback
        }
      });
    } else {
      doUpload();
    }
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
    this.profileStore.updateProfile({
      name: this.editName,
      avatar: this.editAvatar,
      age: this.editAge,
    }).subscribe({
      next: (response) => {
        this.toast.success(response.message || 'Profile updated successfully');
      },
      error: (error) => {
        this.toast.error(error.error?.message || 'Failed to update profile');
      }
    });
  }
}
