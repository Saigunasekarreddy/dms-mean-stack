import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DocumentListComponent } from './pages/document-list/document-list.component';
import { DocumentDetailsComponent } from './pages/document-details/document-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [authGuard] },
  { path: 'documents', component: DocumentListComponent, canActivate: [authGuard] },
  { path: 'documents/:id', component: DocumentDetailsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
