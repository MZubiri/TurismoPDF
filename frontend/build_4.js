const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/app/pages/destinations/destination-form/destination-form.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './destination-form.html',
  styleUrls: ['./destination-form.scss']
})
export class DestinationFormComponent {
  private fb = inject(FormBuilder);
  private destService = inject(DestinationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    imageUrl: [''],
    isActive: [true]
  });
  
  id: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.destService.getById(this.id).subscribe(dest => {
          this.form.patchValue(dest);
        });
      }
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const obs = this.id 
        ? this.destService.update(this.id, this.form.value)
        : this.destService.create(this.form.value);
        
      obs.subscribe(() => this.router.navigate(['/destinations']));
    }
  }
}
`,
  'src/app/pages/destinations/destination-form/destination-form.html': `
<div class="form-container">
  <mat-card class="glass-card">
    <mat-card-header>
      <mat-card-title class="navy-text">{{id ? 'Editar' : 'Nuevo'}} Destino</mat-card-title>
    </mat-card-header>
    <mat-card-content class="mt-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>URL de Imagen</mat-label>
          <input matInput formControlName="imageUrl">
        </mat-form-field>

        <div class="mb-4">
          <mat-slide-toggle formControlName="isActive" color="primary">Activo</mat-slide-toggle>
        </div>

        <div class="actions">
          <button mat-button type="button" routerLink="/destinations">Cancelar</button>
          <button mat-raised-button class="gold-button" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
`,
  'src/app/pages/destinations/destination-form/destination-form.scss': `
.form-container { padding: 1rem; max-width: 600px; margin: 0 auto; }
.navy-text { color: var(--primary-navy); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.actions { display: flex; justify-content: flex-end; gap: 1rem; }
`,

  'src/app/pages/activities/activity-list/activity-list.ts': `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivityService } from '../../../services/activity';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './activity-list.html',
  styleUrls: ['./activity-list.scss']
})
export class ActivityListComponent {
  private actService = inject(ActivityService);
  private destService = inject(DestinationService);
  
  activities = signal<any[]>([]);
  destinations = signal<any[]>([]);
  displayedColumns = ['name', 'destination', 'duration', 'isActive', 'actions'];

  ngOnInit() {
    this.destService.getAll().subscribe(res => this.destinations.set(res));
    this.loadActivities();
  }

  loadActivities(destId?: number) {
    const obs = destId ? this.actService.getByDestination(destId) : this.actService.getAll();
    obs.subscribe(res => this.activities.set(res));
  }

  onDestinationChange(destId: number) {
    this.loadActivities(destId);
  }

  deleteActivity(id: number) {
    if(confirm('¿Eliminar actividad?')) {
      this.actService.delete(id).subscribe(() => this.loadActivities());
    }
  }
}
`,
  'src/app/pages/activities/activity-list/activity-list.html': `
<div class="list-container">
  <div class="header-row">
    <h1 class="navy-text">Actividades</h1>
    <button mat-raised-button class="gold-button" routerLink="/activities/new">
      <mat-icon>add</mat-icon> Nueva Actividad
    </button>
  </div>

  <mat-form-field appearance="outline" class="filter-field">
    <mat-label>Filtrar por Destino</mat-label>
    <mat-select (selectionChange)="onDestinationChange($event.value)">
      <mat-option [value]="null">Todos</mat-option>
      @for (dest of destinations(); track dest.id) {
        <mat-option [value]="dest.id">{{dest.name}}</mat-option>
      }
    </mat-select>
  </mat-form-field>
  
  <table mat-table [dataSource]="activities()" class="mat-elevation-z8">
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> Nombre </th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <ng-container matColumnDef="destination">
      <th mat-header-cell *matHeaderCellDef> Destino </th>
      <td mat-cell *matCellDef="let element"> {{element.destination?.name || 'N/A'}} </td>
    </ng-container>

    <ng-container matColumnDef="duration">
      <th mat-header-cell *matHeaderCellDef> Duración </th>
      <td mat-cell *matCellDef="let element"> {{element.duration}} </td>
    </ng-container>

    <ng-container matColumnDef="isActive">
      <th mat-header-cell *matHeaderCellDef> Activo </th>
      <td mat-cell *matCellDef="let element"> 
        <mat-slide-toggle [checked]="element.isActive" disabled></mat-slide-toggle>
      </td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef> Acciones </th>
      <td mat-cell *matCellDef="let element">
        <button mat-icon-button color="primary" [routerLink]="['/activities/edit', element.id]">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="deleteActivity(element.id)">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
`,
  'src/app/pages/activities/activity-list/activity-list.scss': `
.list-container { padding: 1rem; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.navy-text { color: var(--primary-navy); margin: 0; }
.filter-field { width: 300px; margin-bottom: 1rem; }
table { width: 100%; }
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 4 done');
