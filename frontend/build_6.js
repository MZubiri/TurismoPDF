const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/app/pages/pdf-settings/pdf-settings.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfSettingsService } from '../../services/pdf-settings';

@Component({
  selector: 'app-pdf-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './pdf-settings.html',
  styleUrls: ['./pdf-settings.scss']
})
export class PdfSettingsComponent {
  private fb = inject(FormBuilder);
  private pdfService = inject(PdfSettingsService);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    website: ['', Validators.required]
  });

  ngOnInit() {
    this.pdfService.get().subscribe({
      next: (data) => {
        if(data) this.form.patchValue(data);
      }
    });
  }

  onSubmit() {
    if(this.form.valid) {
      this.pdfService.update(this.form.value).subscribe(() => {
        this.snackBar.open('Datos actualizados correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      });
    }
  }
}
`,
  'src/app/pages/pdf-settings/pdf-settings.html': `
<div class="form-container">
  <mat-card class="glass-card">
    <mat-card-header>
      <mat-card-title class="navy-text">Datos PDF</mat-card-title>
    </mat-card-header>
    <mat-card-content class="mt-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Correo</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Web</mat-label>
          <input matInput formControlName="website">
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button class="gold-button" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
`,
  'src/app/pages/pdf-settings/pdf-settings.scss': `
.form-container { padding: 1rem; max-width: 600px; margin: 0 auto; }
.navy-text { color: var(--primary-navy); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.actions { display: flex; justify-content: flex-end; }
`,

  'src/app/pages/forgot-password/forgot-password.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  
  message = '';

  onSubmit() {
    if (this.form.valid) {
      this.authService.forgotPassword(this.form.value.email!).subscribe({
        next: () => this.message = 'Se ha enviado un enlace a tu correo.',
        error: () => this.message = 'Ocurrió un error.'
      });
    }
  }
}
`,
  'src/app/pages/forgot-password/forgot-password.html': `
<div class="login-container navy-bg">
  <div class="glass-card login-card">
    <h2 class="gold-gradient-text text-center">Recuperar Contraseña</h2>
    
    @if (message) {
      <div class="message text-center mb-4">{{message}}</div>
    }
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Correo Electrónico</mat-label>
        <input matInput formControlName="email" type="email">
      </mat-form-field>
      
      <button mat-raised-button class="gold-button w-100 mt-3" type="submit" [disabled]="form.invalid">
        Enviar enlace
      </button>

      <div class="text-center mt-3">
        <a routerLink="/login" class="gold-text">Volver al login</a>
      </div>
    </form>
  </div>
</div>
`,
  'src/app/pages/forgot-password/forgot-password.scss': `
.login-container { height: 100vh; display: flex; justify-content: center; align-items: center; }
.login-card { width: 100%; max-width: 400px; background: rgba(26, 39, 68, 0.8) !important; }
.w-100 { width: 100%; }
.mt-3 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.text-center { text-align: center; }
.message { color: white; padding: 10px; background: rgba(201, 168, 76, 0.2); border-radius: 4px; }
`,

  'src/app/pages/reset-password/reset-password.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  email = '';

  form = this.fb.group({
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    if (this.form.valid && this.form.value.newPassword === this.form.value.confirmPassword) {
      this.authService.resetPassword({
        token: this.token,
        email: this.email,
        newPassword: this.form.value.newPassword
      }).subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
`,
  'src/app/pages/reset-password/reset-password.html': `
<div class="login-container navy-bg">
  <div class="glass-card login-card">
    <h2 class="gold-gradient-text text-center">Restablecer Contraseña</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nueva Contraseña</mat-label>
        <input matInput formControlName="newPassword" type="password">
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Confirmar Contraseña</mat-label>
        <input matInput formControlName="confirmPassword" type="password">
      </mat-form-field>

      <button mat-raised-button class="gold-button w-100 mt-3" type="submit" [disabled]="form.invalid">
        Restablecer
      </button>
    </form>
  </div>
</div>
`,
  'src/app/pages/reset-password/reset-password.scss': `
.login-container { height: 100vh; display: flex; justify-content: center; align-items: center; }
.login-card { width: 100%; max-width: 400px; background: rgba(26, 39, 68, 0.8) !important; }
.w-100 { width: 100%; }
.mt-3 { margin-top: 1rem; }
.text-center { text-align: center; }
`,

  'src/app/pages/change-password/change-password.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.valid && this.form.value.newPassword === this.form.value.confirmPassword) {
      this.authService.changePassword(this.form.value).subscribe({
        next: () => {
          this.form.reset();
          this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error al cambiar contraseña', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
`,
  'src/app/pages/change-password/change-password.html': `
<div class="form-container">
  <mat-card class="glass-card">
    <mat-card-header>
      <mat-card-title class="navy-text">Cambiar Contraseña</mat-card-title>
    </mat-card-header>
    <mat-card-content class="mt-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Contraseña Actual</mat-label>
          <input matInput formControlName="currentPassword" type="password">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Nueva Contraseña</mat-label>
          <input matInput formControlName="newPassword" type="password">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Confirmar Nueva Contraseña</mat-label>
          <input matInput formControlName="confirmPassword" type="password">
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button class="gold-button" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
`,
  'src/app/pages/change-password/change-password.scss': `
.form-container { padding: 1rem; max-width: 600px; margin: 0 auto; }
.navy-text { color: var(--primary-navy); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.actions { display: flex; justify-content: flex-end; }
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 6 done');
