import { Component, inject, OnInit } from '@angular/core';
import { ProfileStore } from '../../core/state/profile-store';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  public profileStore = inject(ProfileStore);
  private toast = inject(ToastrService);

  editName = '';
  editAvatar = '';
  editAge = 0;

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
