import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { FoodRegion } from '../../../core/models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-regions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  regions = signal<FoodRegion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.foodSvc.fetchRegions().subscribe({
      next: (regions) => {
        this.regions.set(regions);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  addRegion() {
    this.router.navigate(['/food/regions', 'add']);
  }

  editRegion(region: FoodRegion) {
    this.router.navigate(['/food/regions', region.id, 'edit']);
  }

  deleteRegion(region: FoodRegion) {
    if (confirm('Supprimer ' + region.name + ' ?')) {
      this.foodSvc.deleteRegion(region.id).subscribe({
        next: () => {
          this.regions.set(this.regions().filter(r => r.id !== region.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }
}
