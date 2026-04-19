import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-header.html',
  styleUrl: './role-header.css'
})
export class RoleHeaderComponent {
  @Input() role: 'CITIZEN' | 'SPECIALIST' | 'ADMIN' | 'SUPER_ADMIN' = 'CITIZEN';

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  goDashboard(): void {
    switch (this.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'SPECIALIST':
        this.router.navigate(['/specialist/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  goProfile(): void {
    if (this.role === 'CITIZEN') {
      this.router.navigate(['/citizen/profile']);
      return;
    }

    this.goDashboard();
  }

  logout(): void {
    this.authService.logout();
  }
}
