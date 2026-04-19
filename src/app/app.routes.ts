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
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'citizen/profile',
    canActivate: [roleGuard('CITIZEN')],
    loadComponent: () => import('./pages/citizen-profile/citizen-profile').then(m => m.CitizenProfileComponent)
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
  { path: '**', redirectTo: 'login' }
];
