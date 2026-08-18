import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  destinations: any[] = [];
  activities: any[] = [];
  
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
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
    this.destService.getAll().subscribe(res => {
      this.destinations = res;
      this.cdr.markForCheck();
    });

    this.form.get('destinationId')?.valueChanges.subscribe(destId => {
      if (destId) {
        this.actService.getByDestination(destId).subscribe(acts => {
          this.activities = acts;
          const currentActivity = this.form.get('activityId')?.value;
          if (currentActivity && !acts.find(a => a.id === currentActivity)) {
             this.form.get('activityId')?.setValue(null);
          }
          this.cdr.markForCheck();
        });
      } else {
        this.activities = [];
        this.cdr.markForCheck();
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.resService.getById(this.id).subscribe(res => {
          this.form.patchValue(res);
          this.cdr.markForCheck();
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;

      // Format Date to YYYY-MM-DD for .NET 9 DateOnly DTO
      let formattedDate = '';
      if (raw.reservationDate) {
        const d = new Date(raw.reservationDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }

      const payload = {
        firstName: raw.firstName || '',
        lastName: raw.lastName || '',
        phone: raw.phone || '',
        hotel: raw.hotel || '',
        destinationId: Number(raw.destinationId),
        activityId: Number(raw.activityId),
        reservationDate: formattedDate,
        notes: raw.notes || '',
        adults: Number(raw.adults),
        children: Number(raw.children)
      };

      const obs = this.id 
        ? this.resService.update(this.id, payload)
        : this.resService.create(payload);
        
      obs.subscribe({
        next: () => this.router.navigate(['/reservations']),
        error: (err) => console.error('Error al guardar reserva:', err)
      });
    }
  }
}