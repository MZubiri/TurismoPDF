import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    website: ['', Validators.required]
  });

  ngOnInit() {
    this.pdfService.get().subscribe({
      next: (data) => {
        if(data) this.form.patchValue(data);
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      });
    }
  }
}