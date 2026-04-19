// src/app/pages/dashboard/dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RoleHeaderComponent } from '../../components/role-header/role-header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RoleHeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  fullName(): string {
    const user = this.authService.currentUser();
    if (!user) {
      return 'Citizen';
    }

    return `${user.firstName} ${user.lastName}`.trim();
  }
}
