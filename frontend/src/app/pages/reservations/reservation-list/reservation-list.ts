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

  shareWhatsApp(reservation: any, lang: string = 'es') {
    const isEs = lang === 'es';
    const year = new Date(reservation.createdAt || Date.now()).getFullYear();
    const cleanFolio = `GT-${year}-${String(reservation.id).padStart(5, '0')}`;
    const voucherUrl = `https://reservas.toursgotravel.com/api/reservations/${reservation.id}/pdf?lang=${lang}`;
    
    const tourName = reservation.activity?.name || 'su tour';
    const dateStr = reservation.reservationDate || '';
    
    const message = isEs
      ? `¡Hola ${reservation.firstName}! Te compartimos el Voucher de tu reserva (${cleanFolio}) con ToursGoTravel para *${tourName}* el día ${dateStr}.\n\nPuedes consultar y descargar tu comprobante aquí:\n${voucherUrl}`
      : `Hello ${reservation.firstName}! Here is your booking voucher (${cleanFolio}) with ToursGoTravel for *${tourName}* on ${dateStr}.\n\nYou can view and download your voucher here:\n${voucherUrl}`;

    let cleanPhone = (reservation.phone || '').replace(/[^0-9]/g, '');
    
    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  }
}