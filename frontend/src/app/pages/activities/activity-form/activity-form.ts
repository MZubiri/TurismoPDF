import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.destService.getAll().subscribe(res => {
      this.destinations = res;
      this.cdr.markForCheck();
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.actService.getById(this.id).subscribe(act => {
          this.form.patchValue(act);
          this.cdr.markForCheck();
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