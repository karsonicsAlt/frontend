// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CitizenProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalCode: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export interface CitizenProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalCode: string;
  address: string;
  password?: string;
}

export interface SpecialistProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  description: string;
  officeNumber: string;
  workStartTime: string;
  workEndTime: string;
  appointmentDurationMinutes: number;
  isActive: boolean;
  createdAt: string;
}

export interface SpecialistProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  description?: string;
  officeNumber?: string;
  workStartTime?: string;
  workEndTime?: string;
  appointmentDurationMinutes?: number;
  password?: string;
}

export interface AdminProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AdminProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API           = 'http://localhost:8081/api/auth';
  private readonly CITIZENS_API  = 'http://localhost:8081/api/citizens';
  private readonly SPECIALISTS_API = 'http://localhost:8081/api/specialists';
  private readonly ADMINS_API    = 'http://localhost:8081/api/admins';

  currentUser = signal<AuthResponse | null>(this.loadUser());
  isLoggedIn  = signal<boolean>(!!this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  // ── Auth ──────────────────────────────────────────────────────────────────

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap(res => this.persist(res))
    );
  }

  register(data: {
    firstName: string; lastName: string; email: string;
    password: string; phone: string; personalCode: string; address: string;
  }) {
    return this.http.post<AuthResponse>(`${this.API}/register`, data).pipe(
      tap(res => this.persist(res))
    );
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return this.loadUser()?.token ?? null; }
  getRole():  string | null { return this.loadUser()?.role  ?? null; }

  // ── Citizen profile ───────────────────────────────────────────────────────

  getMyCitizenProfile() {
    return this.http.get<CitizenProfile>(`${this.CITIZENS_API}/me`);
  }

  updateMyCitizenProfile(data: CitizenProfileUpdateRequest) {
    return this.http.put<CitizenProfile>(`${this.CITIZENS_API}/me`, data).pipe(
      tap(res => this.syncCurrentUser(res.firstName, res.lastName, res.email))
    );
  }

  // ── Specialist profile ────────────────────────────────────────────────────

  getMySpecialistProfile() {
    return this.http.get<SpecialistProfile>(`${this.SPECIALISTS_API}/me`);
  }

  updateMySpecialistProfile(data: SpecialistProfileUpdateRequest) {
    return this.http.put<SpecialistProfile>(`${this.SPECIALISTS_API}/me`, data).pipe(
      tap(res => this.syncCurrentUser(res.firstName, res.lastName, res.email))
    );
  }

  // ── Admin profile ─────────────────────────────────────────────────────────

  getMyAdminProfile() {
    return this.http.get<AdminProfile>(`${this.ADMINS_API}/me`);
  }

  updateMyAdminProfile(data: AdminProfileUpdateRequest) {
    return this.http.put<AdminProfile>(`${this.ADMINS_API}/me`, data).pipe(
      tap(res => this.syncCurrentUser(res.firstName, res.lastName, res.email))
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private persist(res: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(res));
    this.currentUser.set(res);
    this.isLoggedIn.set(true);
  }

  private syncCurrentUser(firstName: string, lastName: string, email: string) {
    const current = this.currentUser();
    if (!current) return;
    const updated = { ...current, firstName, lastName, email };
    localStorage.setItem('auth', JSON.stringify(updated));
    this.currentUser.set(updated);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  }
}