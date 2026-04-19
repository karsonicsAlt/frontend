// src/app/pages/admin-dashboard/admin-dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RoleHeaderComponent } from '../../components/role-header/role-header';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RoleHeaderComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);

  fullName(): string {
    const user = this.authService.currentUser();
    if (!user) {
      return 'Admin';
    }

    return `${user.firstName} ${user.lastName}`.trim();
  }
}
