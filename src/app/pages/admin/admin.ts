import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../../core/state/admin-store';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { Profile } from '../../core/models/user/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, SlicePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  adminStore = inject(AdminStore);

  readonly allRoles = ['ADMIN', 'MANAGER', 'CUSTOMER'];

  logs():void{
    console.log(this.adminStore.users());
  }

  ngOnInit(): void {
    this.adminStore.loadUsers().subscribe({
      next: () => {
        console.log(this.adminStore.users());
      },
      error: (error) => {
        console.error(error);
        this.adminStore.loadUsers().subscribe();
      }
    });
  }

  getAvailableRoles(user: Profile): string[] {
    const currentRoles = (user.roles || []).map((r: any) =>
      (typeof r === 'string' ? r : r.role).toUpperCase()
    );
    return this.allRoles.filter((role) => !currentRoles.includes(role));
  }

  onAddRole(userId: string, newRole: string) {
    if (newRole) {
      this.adminStore.assignRole(userId, newRole).subscribe();
    }
  }

  onDeactivate(userId: string) {
    this.adminStore.deactivateUser(userId).subscribe();
  }
}
