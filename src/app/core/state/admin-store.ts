import { Injectable, inject, signal } from '@angular/core';
import { AdminApi } from '../services/admin-api';
import { ToastrService } from 'ngx-toastr';
import { Profile } from '../models/user/user';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminStore {
  private adminApi = inject(AdminApi);
  private toastr = inject(ToastrService);

  // --- STATE ---
  users = signal<Profile[]>([]);
  isLoading = signal<boolean>(false);

  // --- ACTIONS ---
  loadUsers() {
    this.isLoading.set(true);
    return this.adminApi.getAllUsers().pipe(
      tap((response) => {
        this.users.set(response.data);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        this.toastr.error(error.error?.message || 'Failed to load users');
        return of(null);
      })
    );
  }

  assignRole(userId: string, newRole: string) {
    return this.adminApi.assignRole(userId, newRole).pipe(
      tap((response) => {
        this.toastr.success(response.message || 'Role updated successfully');
        // Update local state
        // Reload users to get updated roles from server
        this.loadUsers().subscribe();
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Failed to update role');
        return of(null);
      })
    );
  }

  deactivateUser(userId: string) {
    return this.adminApi.deactivateUser(userId).pipe(
      tap((response) => {
        this.toastr.success(response.message || 'User deactivated successfully');
        // Update local state
        this.users.update((users) =>
          users.map((u) =>
            u.userId === userId ? { ...u, active: false } : u
          )
        );
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Failed to deactivate user');
        return of(null);
      })
    );
  }
}
