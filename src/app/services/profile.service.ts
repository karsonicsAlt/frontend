// src/app/services/profile.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly BASE = 'http://localhost:8081/api/profile';

  getMyProfile() {
    return this.http.get<any>(`${this.BASE}/me`);
  }

  updateMyProfile(role: string, data: any) {
    const endpoint = this.resolveEndpoint(role);
    return this.http.put<any>(endpoint, data);
  }

  private resolveEndpoint(role: string): string {
    switch (role) {
      case 'CITIZEN':    return `${this.BASE}/me/citizen`;
      case 'SPECIALIST': return `${this.BASE}/me/specialist`;
      case 'ADMIN':
      case 'SUPER_ADMIN':return `${this.BASE}/me/admin`;
      default:           return `${this.BASE}/me/citizen`;
    }
  }
}