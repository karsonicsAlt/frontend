// src/app/pages/specialist-dashboard/specialist-dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RoleHeaderComponent } from '../../components/role-header/role-header';

@Component({
  selector: 'app-specialist-dashboard',
  standalone: true,
  imports: [CommonModule, RoleHeaderComponent],
  templateUrl: './specialist-dashboard.html',
  styleUrl: './specialist-dashboard.css'
})
export class SpecialistDashboardComponent {
  private readonly authService = inject(AuthService);

  fullName(): string {
    const user = this.authService.currentUser();
    if (!user) {
      return 'Specialist';
    }

    return `${user.firstName} ${user.lastName}`.trim();
  }
}
