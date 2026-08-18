const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/app/layout/main-layout/main-layout.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  
  logout() {
    this.authService.logout();
  }
}
`,
  'src/app/layout/main-layout/main-layout.html': `
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav #sidenav mode="side" opened class="sidenav navy-bg">
    <div class="logo-container">
      <h2 class="gold-gradient-text">GREGROYTOURS.COM</h2>
    </div>
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">dashboard</mat-icon>
        <span class="text-white">Dashboard</span>
      </a>
      <a mat-list-item routerLink="/destinations" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">place</mat-icon>
        <span class="text-white">Destinos</span>
      </a>
      <a mat-list-item routerLink="/activities" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">local_activity</mat-icon>
        <span class="text-white">Actividades</span>
      </a>
      <a mat-list-item routerLink="/reservations" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">book_online</mat-icon>
        <span class="text-white">Reservas</span>
      </a>
      <a mat-list-item routerLink="/pdf-settings" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">settings</mat-icon>
        <span class="text-white">Datos PDF</span>
      </a>
      <a mat-list-item routerLink="/change-password" routerLinkActive="active-link">
        <mat-icon matListItemIcon class="gold-text">lock</mat-icon>
        <span class="text-white">Cambiar Contraseña</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar color="primary" class="top-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon> Salir
      </button>
    </mat-toolbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  </mat-sidenav-content>
</mat-sidenav-container>
`,
  'src/app/layout/main-layout/main-layout.scss': `
.sidenav-container {
  height: 100vh;
}

.sidenav {
  width: 250px;
}

.logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
  }
}

.text-white {
  color: white;
}

.active-link {
  background: rgba(201, 168, 76, 0.1);
  border-left: 4px solid var(--accent-gold);
}

.top-toolbar {
  background-color: white;
  color: var(--primary-navy);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spacer {
  flex: 1 1 auto;
}

.main-content {
  padding: 24px;
  height: calc(100vh - 64px - 48px);
  overflow-y: auto;
}
`,

  'src/app/pages/login/login.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error(err)
      });
    }
  }
}
`,
  'src/app/pages/login/login.html': `
<div class="login-container navy-bg">
  <div class="glass-card login-card">
    <h1 class="gold-gradient-text text-center">GREGROY TOURS</h1>
    <h3 class="text-center mb-4 text-white">Iniciar Sesión</h3>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Correo Electrónico</mat-label>
        <input matInput formControlName="email" type="email">
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Contraseña</mat-label>
        <input matInput formControlName="password" type="password">
      </mat-form-field>

      <button mat-raised-button class="gold-button w-100 mt-3" type="submit" [disabled]="loginForm.invalid">
        Ingresar
      </button>

      <div class="text-center mt-3">
        <a routerLink="/forgot-password" class="gold-text">¿Olvidé mi contraseña?</a>
      </div>
    </form>
  </div>
</div>
`,
  'src/app/pages/login/login.scss': `
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(26, 39, 68, 0.8) !important;
}
.w-100 { width: 100%; }
.mt-3 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.text-center { text-align: center; }
.text-white { color: white; }
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 2 done');
