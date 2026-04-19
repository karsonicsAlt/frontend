// src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  form = {
    firstName: '', lastName: '', email: '',
    password: '', phone: '', personalCode: '', address: ''
  };
  error   = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error   = '';
    this.loading = true;

    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error   = err.error?.message ?? 'Registration failed.';
        this.loading = false;
      }
    });
  }
}