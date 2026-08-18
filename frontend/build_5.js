const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/app/pages/activities/activity-form/activity-form.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { ActivityService } from '../../../services/activity';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.scss']
})
export class ActivityFormComponent {
  private fb = inject(FormBuilder);
  private actService = inject(ActivityService);
  private destService = inject(DestinationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  destinations: any[] = [];
  
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    duration: [''],
    destinationId: [null, Validators.required],
    isActive: [true]
  });
  
  id: number | null = null;

  ngOnInit() {
    this.destService.getAll().subscribe(res => this.destinations = res);

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.actService.getById(this.id).subscribe(act => {
          this.form.patchValue(act);
        });
      }
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const obs = this.id 
        ? this.actService.update(this.id, this.form.value)
        : this.actService.create(this.form.value);
        
      obs.subscribe(() => this.router.navigate(['/activities']));
    }
  }
}
`,
  'src/app/pages/activities/activity-form/activity-form.html': `
<div class="form-container">
  <mat-card class="glass-card">
    <mat-card-header>
      <mat-card-title class="navy-text">{{id ? 'Editar' : 'Nueva'}} Actividad</mat-card-title>
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
          <mat-label>Duración</mat-label>
          <input matInput formControlName="duration">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Destino</mat-label>
          <mat-select formControlName="destinationId">
            @for (dest of destinations; track dest.id) {
              <mat-option [value]="dest.id">{{dest.name}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="mb-4">
          <mat-slide-toggle formControlName="isActive" color="primary">Activo</mat-slide-toggle>
        </div>

        <div class="actions">
          <button mat-button type="button" routerLink="/activities">Cancelar</button>
          <button mat-raised-button class="gold-button" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
`,
  'src/app/pages/activities/activity-form/activity-form.scss': `
.form-container { padding: 1rem; max-width: 600px; margin: 0 auto; }
.navy-text { color: var(--primary-navy); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.actions { display: flex; justify-content: flex-end; gap: 1rem; }
`,

  'src/app/pages/reservations/reservation-list/reservation-list.ts': `import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '../../../services/reservation';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './reservation-list.html',
  styleUrls: ['./reservation-list.scss']
})
export class ReservationListComponent {
  private resService = inject(ReservationService);
  
  reservations = signal<any[]>([]);
  displayedColumns = ['folio', 'fullName', 'destination', 'activity', 'date', 'passengers', 'actions'];

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.resService.getAll().subscribe(res => this.reservations.set(res));
  }

  deleteReservation(id: number) {
    if(confirm('¿Eliminar reserva?')) {
      this.resService.delete(id).subscribe(() => this.loadReservations());
    }
  }

  downloadPdf(id: number, lang: string) {
    this.resService.downloadPdf(id, lang);
  }
}
`,
  'src/app/pages/reservations/reservation-list/reservation-list.html': `
<div class="list-container">
  <div class="header-row">
    <h1 class="navy-text">Reservas</h1>
    <button mat-raised-button class="gold-button" routerLink="/reservations/new">
      <mat-icon>add</mat-icon> Nueva Reserva
    </button>
  </div>
  
  <table mat-table [dataSource]="reservations()" class="mat-elevation-z8">
    <ng-container matColumnDef="folio">
      <th mat-header-cell *matHeaderCellDef> Folio </th>
      <td mat-cell *matCellDef="let element"> <b>{{element.folio}}</b> </td>
    </ng-container>

    <ng-container matColumnDef="fullName">
      <th mat-header-cell *matHeaderCellDef> Nombre </th>
      <td mat-cell *matCellDef="let element"> {{element.names}} {{element.lastNames}} </td>
    </ng-container>

    <ng-container matColumnDef="destination">
      <th mat-header-cell *matHeaderCellDef> Destino </th>
      <td mat-cell *matCellDef="let element"> {{element.destination?.name}} </td>
    </ng-container>

    <ng-container matColumnDef="activity">
      <th mat-header-cell *matHeaderCellDef> Actividad </th>
      <td mat-cell *matCellDef="let element"> {{element.activity?.name}} </td>
    </ng-container>

    <ng-container matColumnDef="date">
      <th mat-header-cell *matHeaderCellDef> Fecha </th>
      <td mat-cell *matCellDef="let element"> {{element.reservationDate | date:'mediumDate'}} </td>
    </ng-container>
    
    <ng-container matColumnDef="passengers">
      <th mat-header-cell *matHeaderCellDef> Pasajeros </th>
      <td mat-cell *matCellDef="let element"> Ad: {{element.adults}} | Ni: {{element.children}} </td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef> Acciones </th>
      <td mat-cell *matCellDef="let element">
        <button mat-icon-button color="primary" [routerLink]="['/reservations/edit', element.id]">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="deleteReservation(element.id)">
          <mat-icon>delete</mat-icon>
        </button>
        <button mat-icon-button (click)="downloadPdf(element.id, 'es')" title="Descargar PDF (ES)">
          <span>🇪🇸</span>
        </button>
        <button mat-icon-button (click)="downloadPdf(element.id, 'en')" title="Descargar PDF (EN)">
          <span>🇺🇸</span>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
`,
  'src/app/pages/reservations/reservation-list/reservation-list.scss': `
.list-container { padding: 1rem; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.navy-text { color: var(--primary-navy); margin: 0; }
table { width: 100%; }
td span { font-size: 1.2rem; }
`,
  'src/app/pages/reservations/reservation-form/reservation-form.ts': `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservationService } from '../../../services/reservation';
import { DestinationService } from '../../../services/destination';
import { ActivityService } from '../../../services/activity';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './reservation-form.html',
  styleUrls: ['./reservation-form.scss']
})
export class ReservationFormComponent {
  private fb = inject(FormBuilder);
  private resService = inject(ReservationService);
  private destService = inject(DestinationService);
  private actService = inject(ActivityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  destinations: any[] = [];
  activities: any[] = [];
  
  form = this.fb.group({
    names: ['', Validators.required],
    lastNames: ['', Validators.required],
    phone: [''],
    hotel: [''],
    destinationId: [null, Validators.required],
    activityId: [null, Validators.required],
    reservationDate: [null, Validators.required],
    notes: [''],
    adults: [1, [Validators.required, Validators.min(1)]],
    children: [0, [Validators.required, Validators.min(0)]]
  });
  
  id: number | null = null;

  ngOnInit() {
    this.destService.getAll().subscribe(res => this.destinations = res);

    this.form.get('destinationId')?.valueChanges.subscribe(destId => {
      if (destId) {
        this.actService.getByDestination(destId).subscribe(acts => {
          this.activities = acts;
          const currentActivity = this.form.get('activityId')?.value;
          if (currentActivity && !acts.find(a => a.id === currentActivity)) {
             this.form.get('activityId')?.setValue(null);
          }
        });
      } else {
        this.activities = [];
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.resService.getById(this.id).subscribe(res => {
          this.form.patchValue(res);
        });
      }
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const obs = this.id 
        ? this.resService.update(this.id, this.form.value)
        : this.resService.create(this.form.value);
        
      obs.subscribe(() => this.router.navigate(['/reservations']));
    }
  }
}
`,
  'src/app/pages/reservations/reservation-form/reservation-form.html': `
<div class="form-container">
  <mat-card class="glass-card">
    <mat-card-header>
      <mat-card-title class="navy-text">{{id ? 'Editar' : 'Nueva'}} Reserva</mat-card-title>
    </mat-card-header>
    <mat-card-content class="mt-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="grid-2">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Nombre(s)</mat-label>
            <input matInput formControlName="names">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Apellidos</mat-label>
            <input matInput formControlName="lastNames">
          </mat-form-field>
        </div>

        <div class="grid-2">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Hotel</mat-label>
            <input matInput formControlName="hotel">
          </mat-form-field>
        </div>

        <div class="mb-4">
          <mat-label class="d-block mb-2 font-weight-bold">Destino:</mat-label>
          <mat-radio-group formControlName="destinationId" class="radio-group">
            @for (dest of destinations; track dest.id) {
              <mat-radio-button [value]="dest.id">{{dest.name}}</mat-radio-button>
            }
          </mat-radio-group>
        </div>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Tour/Actividad</mat-label>
          <mat-select formControlName="activityId">
            @for (act of activities; track act.id) {
              <mat-option [value]="act.id">{{act.name}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="reservationDate">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Notas</mat-label>
          <textarea matInput formControlName="notes"></textarea>
        </mat-form-field>

        <div class="grid-2">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Adultos</mat-label>
            <input matInput type="number" formControlName="adults" min="1">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Niños</mat-label>
            <input matInput type="number" formControlName="children" min="0">
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-button type="button" routerLink="/reservations">Cancelar</button>
          <button mat-raised-button class="gold-button" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
`,
  'src/app/pages/reservations/reservation-form/reservation-form.scss': `
.form-container { padding: 1rem; max-width: 800px; margin: 0 auto; }
.navy-text { color: var(--primary-navy); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.d-block { display: block; }
.font-weight-bold { font-weight: 600; }
.actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;}
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.radio-group { display: flex; flex-direction: column; gap: 0.5rem; }
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 5 done');
