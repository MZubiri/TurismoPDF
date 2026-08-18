import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.resService.getAll().subscribe(res => {
      this.totalReservations.set(res.length);
      this.cdr.markForCheck();
    });

    this.destService.getAll().subscribe(res => {
      this.totalDestinations.set(res.filter((d: any) => d.isActive).length);
      this.cdr.markForCheck();
    });

    this.actService.getAll().subscribe(res => {
      this.totalActivities.set(res.length);
      this.cdr.markForCheck();
    });
  }
}