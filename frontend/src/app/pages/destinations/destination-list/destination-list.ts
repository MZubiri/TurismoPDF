import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  
  destinations = signal<any[]>([]);
  displayedColumns = ['name', 'description', 'isActive', 'actions'];

  ngOnInit() {
    this.loadDestinations();
  }

  loadDestinations() {
    this.destService.getAll().subscribe(res => {
      this.destinations.set(res);
      this.cdr.markForCheck();
    });
  }

  deleteDestination(id: number) {
    if(confirm('¿Eliminar destino?')) {
      this.destService.delete(id).subscribe(() => this.loadDestinations());
    }
  }
}