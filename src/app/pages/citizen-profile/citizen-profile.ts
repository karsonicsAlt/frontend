import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AuthService,
  CitizenProfileUpdateRequest
} from '../../services/auth.service';
import { RoleHeaderComponent } from '../../components/role-header/role-header';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-citizen-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleHeaderComponent],
  templateUrl: './citizen-profile.html',
  styleUrl: './citizen-profile.css'
})
export class CitizenProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);

  loading = true;
  saving = false;
  error = '';
  success = '';

  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    personalCode: '',
    address: '',
    password: ''
  };

  ngOnInit(): void {
    setTimeout(() => this.loadProfile(), 100);
  }

  private loadProfile(): void {
    this.loading = true;
    this.error = '';

    this.authService.getMyCitizenProfile().pipe(
      timeout(10000),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (profile) => {
        this.form.firstName = profile.firstName;
        this.form.lastName = profile.lastName;
        this.form.email = profile.email;
        this.form.phone = profile.phone;
        this.form.personalCode = profile.personalCode;
        this.form.address = profile.address;
        this.form.password = '';
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed to load your profile.';
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.saving = true;

    const payload: CitizenProfileUpdateRequest = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phone: this.form.phone,
      personalCode: this.form.personalCode,
      address: this.form.address,
      password: this.form.password.trim() ? this.form.password : undefined
    };

    this.authService.updateMyCitizenProfile(payload).subscribe({
      next: () => {
        this.success = 'Profile updated successfully.';
        this.form.password = '';
        this.saving = false;
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed to update profile.';
        this.saving = false;
      }
    });
  }
}
