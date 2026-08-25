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

  sendClientWhatsApp(reservation: any) {
    const name = `${reservation.firstName || ''} ${reservation.lastName || ''}`.trim() || 'Cliente';
    const tour = reservation.activity?.name || 'Tour';
    const destination = reservation.destination?.name ? `${reservation.destination.name}` : '';
    const tourWithDest = destination ? `${tour} (${destination})` : tour;
    
    let formattedDate = reservation.reservationDate || '';
    if (reservation.reservationDate && typeof reservation.reservationDate === 'string' && reservation.reservationDate.includes('-')) {
      const parts = reservation.reservationDate.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    const hotel = reservation.hotel || 'No especificado';
    const notes = reservation.notes ? reservation.notes.trim() : 'Ninguna';
    const voucherUrl = `https://reservas.toursgotravel.com/api/reservations/${reservation.id}/pdf?lang=es`;

    const message = `¡Hola ${name}! 🌊✨
¡Gracias por reservar con ToursGoTravel!

Confirmamos tu reserva:
• Tour: ${tourWithDest}
• Fecha: ${formattedDate}
• Hotel / Punto de partida: ${hotel}
• Notas: ${notes}

📄 Tu Voucher de acceso:
${voucherUrl}

¡Estamos a tu disposición para cualquier duda antes de tu tour!`;

    let cleanPhone = (reservation.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '52' + cleanPhone;
    }

    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  }

  shareWhatsApp(reservation: any, lang: string = 'es') {
    const voucherUrl = `https://reservas.toursgotravel.com/api/reservations/${reservation.id}/pdf?lang=${lang}`;
    let cleanPhone = (reservation.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '52' + cleanPhone;
    }
    
    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(voucherUrl)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(voucherUrl)}`;

    window.open(waUrl, '_blank');
  }
}