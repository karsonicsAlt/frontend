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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8081/api/auth';
  private readonly CITIZENS_API = 'http://localhost:8081/api/citizens';

  // Reactive state — components can read these directly
  currentUser = signal<AuthResponse | null>(this.loadUser());
  isLoggedIn  = signal<boolean>(!!this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

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

  getMyCitizenProfile() {
    return this.http.get<CitizenProfile>(`${this.CITIZENS_API}/me`);
  }

  updateMyCitizenProfile(data: CitizenProfileUpdateRequest) {
    return this.http.put<CitizenProfile>(`${this.CITIZENS_API}/me`, data).pipe(
      tap((res) => this.syncCurrentUser(res.firstName, res.lastName, res.email))
    );
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.loadUser()?.token ?? null;
  }

  getRole(): string | null {
    return this.loadUser()?.role ?? null;
  }

  private persist(res: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(res));
    this.currentUser.set(res);
    this.isLoggedIn.set(true);
  }

  private syncCurrentUser(firstName: string, lastName: string, email: string) {
    const current = this.currentUser();
    if (!current) {
      return;
    }

    const updated = { ...current, firstName, lastName, email };
    localStorage.setItem('auth', JSON.stringify(updated));
    this.currentUser.set(updated);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  }
}
