import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  
  reservations = signal<any[]>([]);
  displayedColumns = ['folio', 'fullName', 'destination', 'activity', 'date', 'passengers', 'actions'];

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.resService.getAll().subscribe(res => {
      this.reservations.set(res);
      this.cdr.markForCheck();
    });
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