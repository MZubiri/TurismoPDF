const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/styles.scss': `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

html, body { height: 100%; margin: 0; font-family: 'Inter', sans-serif; background-color: #f5f7fa; color: #333; }

:root {
  --primary-navy: #1a2744;
  --accent-gold: #c9a84c;
  --bg-light: #f5f7fa;
  --text-main: #333;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
}

.gold-gradient-text {
  background: linear-gradient(45deg, #c9a84c, #e8d082);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gold-button {
  background: linear-gradient(45deg, #c9a84c, #e8d082) !important;
  color: #1a2744 !important;
  font-weight: 600 !important;
}

.navy-bg { background-color: var(--primary-navy); }
.gold-text { color: var(--accent-gold); }

/* Table styling */
.mat-mdc-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.mat-mdc-header-row {
  background-color: var(--primary-navy);
}

.mat-mdc-header-cell {
  color: white !important;
  font-weight: 600 !important;
}

.mat-mdc-row:nth-child(even) {
  background-color: #f9f9f9;
}

.mat-mdc-row:hover {
  background-color: #f0f4f8;
  transition: background-color 0.2s ease;
}
`,

  'src/app/services/auth.ts': `import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl + '/auth';

  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  login(credentials: any) {
    return this.http.post<any>(\`\${this.apiUrl}/login\`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  changePassword(data: any) {
    return this.http.post(\`\${this.apiUrl}/change-password\`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(\`\${this.apiUrl}/forgot-password\`, { email });
  }

  resetPassword(data: any) {
    return this.http.post(\`\${this.apiUrl}/reset-password\`, data);
  }
}
`,

  'src/app/services/destination.ts': `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/destinations';

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getById(id: number) { return this.http.get<any>(\`\${this.apiUrl}/\${id}\`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(\`\${this.apiUrl}/\${id}\`, data); }
  delete(id: number) { return this.http.delete(\`\${this.apiUrl}/\${id}\`); }
}
`,

  'src/app/services/activity.ts': `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/activities';

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getByDestination(destId: number) { return this.http.get<any[]>(\`\${this.apiUrl}?destinationId=\${destId}\`); }
  getById(id: number) { return this.http.get<any>(\`\${this.apiUrl}/\${id}\`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(\`\${this.apiUrl}/\${id}\`, data); }
  delete(id: number) { return this.http.delete(\`\${this.apiUrl}/\${id}\`); }
}
`,

  'src/app/services/reservation.ts': `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/reservations';

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getById(id: number) { return this.http.get<any>(\`\${this.apiUrl}/\${id}\`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(\`\${this.apiUrl}/\${id}\`, data); }
  delete(id: number) { return this.http.delete(\`\${this.apiUrl}/\${id}\`); }

  downloadPdf(id: number, lang: string) {
    return this.http.get(\`\${this.apiUrl}/\${id}/pdf?lang=\${lang}\`, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`reservation-\${id}-\${lang}.pdf\`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generatePdf(id: number, lang: string) {
    return this.http.post(\`\${this.apiUrl}/\${id}/pdf?lang=\${lang}\`, {});
  }
}
`,

  'src/app/services/pdf-settings.ts': `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PdfSettingsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/pdfsettings';

  get() { return this.http.get<any>(this.apiUrl); }
  update(data: any) { return this.http.put(this.apiUrl, data); }
}
`,

  'src/app/guards/auth-guard.ts': `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
`,

  'src/app/interceptors/error-interceptor.ts': `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        authService.logout();
      } else {
        console.error('HTTP Error:', err);
      }
      return throwError(() => err);
    })
  );
};
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 1 done');
