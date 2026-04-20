// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },

  // ── Dashboards ──
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'specialist/dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/specialist-dashboard/specialist-dashboard').then(m => m.SpecialistDashboardComponent)
  },

  // ── Unified profile (all logged-in roles) ──
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfileComponent)
  },

  // Keep old citizen/profile path as an alias so existing links don't break
  {
    path: 'citizen/profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfileComponent)
  },

  { path: '**', redirectTo: 'login' }
];