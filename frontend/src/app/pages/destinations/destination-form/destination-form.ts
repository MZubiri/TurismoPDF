import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './destination-form.html',
  styleUrls: ['./destination-form.scss']
})
export class DestinationFormComponent {
  private fb = inject(FormBuilder);
  private destService = inject(DestinationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    imageUrl: [''],
    isActive: [true]
  });
  
  id: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam) {
        this.id = +idParam;
        this.destService.getById(this.id).subscribe(dest => {
          this.form.patchValue(dest);
          this.cdr.markForCheck();
        });
      }
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const obs = this.id 
        ? this.destService.update(this.id, this.form.value)
        : this.destService.create(this.form.value);
        
      obs.subscribe(() => this.router.navigate(['/destinations']));
    }
  }
}