import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { DestinationListComponent } from './pages/destinations/destination-list/destination-list';
import { DestinationFormComponent } from './pages/destinations/destination-form/destination-form';
import { ActivityListComponent } from './pages/activities/activity-list/activity-list';
import { ActivityFormComponent } from './pages/activities/activity-form/activity-form';
import { ReservationListComponent } from './pages/reservations/reservation-list/reservation-list';
import { ReservationFormComponent } from './pages/reservations/reservation-form/reservation-form';
import { PdfSettingsComponent } from './pages/pdf-settings/pdf-settings';
import { ChangePasswordComponent } from './pages/change-password/change-password';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'destinations', component: DestinationListComponent },
      { path: 'destinations/new', component: DestinationFormComponent },
      { path: 'destinations/edit/:id', component: DestinationFormComponent },
      { path: 'activities', component: ActivityListComponent },
      { path: 'activities/new', component: ActivityFormComponent },
      { path: 'activities/edit/:id', component: ActivityFormComponent },
      { path: 'reservations', component: ReservationListComponent },
      { path: 'reservations/new', component: ReservationFormComponent },
      { path: 'reservations/edit/:id', component: ReservationFormComponent },
      { path: 'pdf-settings', component: PdfSettingsComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
