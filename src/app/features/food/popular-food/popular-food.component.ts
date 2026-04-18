import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { PopularFood } from '../../../core/models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popular-food',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-food.component.html',
  styleUrls: ['./popular-food.component.css']
})
export class PopularFoodComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  foods = signal<PopularFood[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.foodSvc.fetchPopularFoods().subscribe({
      next: (foods) => {
        this.foods.set(foods);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  addFood() {
    this.router.navigate(['/food/popular', 'add']);
  }

  editFood(food: PopularFood) {
    this.router.navigate(['/food/popular', food.id, 'edit']);
  }

  deleteFood(food: PopularFood) {
    if (confirm('Supprimer ' + food.name + ' ?')) {
      this.foodSvc.deletePopular(food.id).subscribe({
        next: () => {
          this.foods.set(this.foods().filter(f => f.id !== food.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }
}
