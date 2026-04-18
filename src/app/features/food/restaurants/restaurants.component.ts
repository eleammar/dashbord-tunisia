import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { Restaurant } from '../../../core/models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-restaurants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  restaurants = signal<Restaurant[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.foodSvc.fetchRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants.set(restaurants);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  addRestaurant() {
    this.router.navigate(['/food/restaurants', 'add']);
  }

  editRestaurant(restaurant: Restaurant) {
    this.router.navigate(['/food/restaurants', restaurant.id, 'edit']);
  }

  deleteRestaurant(restaurant: Restaurant) {
    if (confirm('Supprimer ' + restaurant.name + ' ?')) {
      this.foodSvc.deleteRestaurant(restaurant.id).subscribe({
        next: () => {
          this.restaurants.set(this.restaurants().filter(r => r.id !== restaurant.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }
}
