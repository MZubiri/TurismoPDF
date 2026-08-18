const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Celinee\\Desktop\\PROYECTO\\TurismoPDF\\frontend';

const files = {
  'src/app/pages/dashboard/dashboard.ts': `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReservationService } from '../../services/reservation';
import { DestinationService } from '../../services/destination';
import { ActivityService } from '../../services/activity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  totalReservations = signal(0);
  totalDestinations = signal(0);
  totalActivities = signal(0);

  private resService = inject(ReservationService);
  private destService = inject(DestinationService);
  private actService = inject(ActivityService);

  ngOnInit() {
    this.resService.getAll().subscribe(res => this.totalReservations.set(res.length));
    this.destService.getAll().subscribe(res => this.totalDestinations.set(res.filter((d:any) => d.isActive).length));
    this.actService.getAll().subscribe(res => this.totalActivities.set(res.length));
  }
}
`,
  'src/app/pages/dashboard/dashboard.html': `
<div class="dashboard-container">
  <h1 class="navy-text mb-4">Dashboard</h1>
  <div class="cards-grid">
    <mat-card class="stat-card">
      <mat-card-content>
        <h3 class="gold-text">Total Reservas</h3>
        <p class="stat-value">{{totalReservations()}}</p>
      </mat-card-content>
    </mat-card>
    <mat-card class="stat-card">
      <mat-card-content>
        <h3 class="gold-text">Destinos Activos</h3>
        <p class="stat-value">{{totalDestinations()}}</p>
      </mat-card-content>
    </mat-card>
    <mat-card class="stat-card">
      <mat-card-content>
        <h3 class="gold-text">Actividades</h3>
        <p class="stat-value">{{totalActivities()}}</p>
      </mat-card-content>
    </mat-card>
  </div>
</div>
`,
  'src/app/pages/dashboard/dashboard.scss': `
.navy-text { color: var(--primary-navy); }
.gold-text { color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.dashboard-container { padding: 1rem; }
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.stat-card {
  border-left: 4px solid var(--accent-gold);
  border-radius: 8px;
}
.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-navy);
  margin: 0;
}
`,
  'src/app/pages/destinations/destination-list/destination-list.ts': `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './destination-list.html',
  styleUrls: ['./destination-list.scss']
})
export class DestinationListComponent {
  private destService = inject(DestinationService);
  destinations = signal<any[]>([]);
  displayedColumns = ['name', 'description', 'isActive', 'actions'];

  ngOnInit() {
    this.loadDestinations();
  }

  loadDestinations() {
    this.destService.getAll().subscribe(res => this.destinations.set(res));
  }

  deleteDestination(id: number) {
    if(confirm('¿Eliminar destino?')) {
      this.destService.delete(id).subscribe(() => this.loadDestinations());
    }
  }
}
`,
  'src/app/pages/destinations/destination-list/destination-list.html': `
<div class="list-container">
  <div class="header-row">
    <h1 class="navy-text">Destinos</h1>
    <button mat-raised-button class="gold-button" routerLink="/destinations/new">
      <mat-icon>add</mat-icon> Nuevo Destino
    </button>
  </div>
  
  <table mat-table [dataSource]="destinations()" class="mat-elevation-z8">
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> Nombre </th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <ng-container matColumnDef="description">
      <th mat-header-cell *matHeaderCellDef> Descripción </th>
      <td mat-cell *matCellDef="let element"> {{element.description}} </td>
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
        <button mat-icon-button color="primary" [routerLink]="['/destinations/edit', element.id]">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="deleteDestination(element.id)">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
`,
  'src/app/pages/destinations/destination-list/destination-list.scss': `
.list-container { padding: 1rem; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.navy-text { color: var(--primary-navy); margin: 0; }
table { width: 100%; }
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Script 3 done');
