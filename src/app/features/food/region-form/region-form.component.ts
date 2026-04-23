import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { FoodRegion } from '../../../core/models/food.model';

@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.css']
})

export class RegionFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  isEdit = false;
  regionId: number | null = null;
  selectedFiles: File[] = [];
uploadError: any;
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      specialty: ['', Validators.required],
      description: ['', Validators.required],
      images: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.regionId = +id;
        this.loading = true;
        this.foodService.getRegionById(+id).subscribe({
          next: (region: FoodRegion) => {
            this.form.patchValue({
              name: region.name,
              specialty: region.specialty,
              description: region.description,
              images: region.images ? region.images.join(', ') : ''
            });
            this.loading = false;
          },
          error: () => {
            this.error = 'Erreur de chargement de la région';
            this.loading = false;
          }
        });
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    // Use FormData for the entire form
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('specialty', this.form.value.specialty);
    formData.append('description', this.form.value.description);
    // Add images from text input (URLs)
    if (this.form.value.images) {
      this.form.value.images.split(',').map((img: string) => img.trim()).forEach((url: string) => {
        if (url) formData.append('images', url);
      });
    }
    // Add files from file input
    if (this.selectedFiles.length) {
      this.selectedFiles.forEach(file => formData.append('images', file));
    }
    const req$ = this.isEdit && this.regionId
      ? this.foodService.updateRegion(this.regionId, formData)
      : this.foodService.createRegion(formData);
    req$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/food']);
      },
      error: () => {
        this.error = this.isEdit ? 'Erreur lors de la modification' : 'Erreur lors de la création';
        this.loading = false;
      }
    });
  }
}
