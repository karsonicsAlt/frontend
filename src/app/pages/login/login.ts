// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error   = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        // Redirect based on role
        switch (res.role) {
          case 'SUPER_ADMIN':
          case 'ADMIN':      this.router.navigate(['/admin/dashboard']); break;
          case 'SPECIALIST': this.router.navigate(['/specialist/dashboard']); break;
          default:           this.router.navigate(['/dashboard']); break;
        }
      },
      error: (err) => {
        this.error   = err.error?.message ?? 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}