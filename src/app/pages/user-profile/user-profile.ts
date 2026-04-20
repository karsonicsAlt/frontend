// src/app/pages/user-profile/user-profile.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, CitizenProfileUpdateRequest } from '../../services/auth.service';
import { RoleHeaderComponent } from '../../components/role-header/role-header';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleHeaderComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);

  role: 'CITIZEN' | 'SPECIALIST' | 'ADMIN' | 'SUPER_ADMIN' = 'CITIZEN';

  loading = true;
  saving  = false;
  error   = '';
  success = '';

  // Shared fields
  form = {
    firstName:   '',
    lastName:    '',
    email:       '',
    phone:       '',
    password:    '',
    // Citizen-only
    personalCode: '',
    address:      '',
    // Specialist-only
    jobTitle:     '',
    department:   '',
    description:  '',
    officeNumber: '',
    workStartTime: '',
    workEndTime:   '',
    appointmentDurationMinutes: 30,
  };

  ngOnInit(): void {
    const raw = this.authService.getRole();
    if (raw === 'SPECIALIST' || raw === 'ADMIN' || raw === 'SUPER_ADMIN') {
      this.role = raw as any;
    }
    this.loadProfile();
  }

  get isCitizen()    { return this.role === 'CITIZEN'; }
  get isSpecialist() { return this.role === 'SPECIALIST'; }
  get isAdmin()      { return this.role === 'ADMIN' || this.role === 'SUPER_ADMIN'; }

  get roleLabel(): string {
    switch (this.role) {
      case 'SPECIALIST': return 'Specialist';
      case 'ADMIN':      return 'Admin';
      case 'SUPER_ADMIN': return 'Super Admin';
      default:           return 'Citizen';
    }
  }

  private loadProfile(): void {
    this.loading = true;
    this.error   = '';

    let request$;
    if (this.isSpecialist) {
      request$ = this.authService.getMySpecialistProfile();
    } else if (this.isAdmin) {
      request$ = this.authService.getMyAdminProfile();
    } else {
      request$ = this.authService.getMyCitizenProfile();
    }

    request$.pipe(
      timeout(10_000),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: (data: any) => {
        this.form.firstName = data.firstName ?? '';
        this.form.lastName  = data.lastName  ?? '';
        this.form.email     = data.email     ?? '';
        this.form.phone     = data.phone     ?? '';
        this.form.password  = '';

        if (this.isCitizen) {
          this.form.personalCode = data.personalCode ?? '';
          this.form.address      = data.address      ?? '';
        }
        if (this.isSpecialist) {
          this.form.jobTitle    = data.jobTitle    ?? '';
          this.form.department  = data.department  ?? '';
          this.form.description = data.description ?? '';
          this.form.officeNumber = data.officeNumber ?? '';
          this.form.workStartTime = data.workStartTime ?? '';
          this.form.workEndTime   = data.workEndTime   ?? '';
          this.form.appointmentDurationMinutes = data.appointmentDurationMinutes ?? 30;
        }
      },
      error: (err: any) => {
        this.error = err.error?.message ?? 'Failed to load profile.';
      }
    });
  }

  onSubmit(): void {
    this.error   = '';
    this.success = '';
    this.saving  = true;

    let request$;

    if (this.isSpecialist) {
      const payload: any = {
        firstName:   this.form.firstName,
        lastName:    this.form.lastName,
        email:       this.form.email,
        phone:       this.form.phone,
        jobTitle:    this.form.jobTitle,
        department:  this.form.department,
        description: this.form.description,
        officeNumber: this.form.officeNumber,
        workStartTime: this.form.workStartTime,
        workEndTime:   this.form.workEndTime,
        appointmentDurationMinutes: this.form.appointmentDurationMinutes,
        password: this.form.password.trim() || undefined,
      };
      request$ = this.authService.updateMySpecialistProfile(payload);

    } else if (this.isAdmin) {
      const payload: any = {
        firstName: this.form.firstName,
        lastName:  this.form.lastName,
        email:     this.form.email,
        phone:     this.form.phone,
        password:  this.form.password.trim() || undefined,
      };
      request$ = this.authService.updateMyAdminProfile(payload);

    } else {
      const payload: CitizenProfileUpdateRequest = {
        firstName:    this.form.firstName,
        lastName:     this.form.lastName,
        email:        this.form.email,
        phone:        this.form.phone,
        personalCode: this.form.personalCode,
        address:      this.form.address,
        password:     this.form.password.trim() || undefined,
      };
      request$ = this.authService.updateMyCitizenProfile(payload);
    }

    request$.pipe(
      finalize(() => { this.saving = false; })
    ).subscribe({
      next: () => {
        this.success = 'Profile updated successfully.';
        this.form.password = '';
      },
      error: (err: any) => {
        this.error = err.error?.message ?? 'Failed to update profile.';
      }
    });
  }
}