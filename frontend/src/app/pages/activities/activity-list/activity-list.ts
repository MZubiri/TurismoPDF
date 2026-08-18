import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  
  activities = signal<any[]>([]);
  destinations = signal<any[]>([]);
  displayedColumns = ['name', 'destination', 'duration', 'isActive', 'actions'];

  ngOnInit() {
    this.destService.getAll().subscribe(res => {
      this.destinations.set(res);
      this.cdr.markForCheck();
    });
    this.loadActivities();
  }

  loadActivities(destId?: number) {
    const obs = destId ? this.actService.getByDestination(destId) : this.actService.getAll();
    obs.subscribe(res => {
      this.activities.set(res);
      this.cdr.markForCheck();
    });
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