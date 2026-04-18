import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { FoodCategory } from '../../../core/models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  categories = signal<FoodCategory[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.foodSvc.fetchCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  addCategory() {
    this.router.navigate(['/food/categories', 'add']);
  }

  editCategory(category: FoodCategory) {
    this.router.navigate(['/food/categories', category.id, 'edit']);
  }

  deleteCategory(category: FoodCategory) {
    if (confirm('Supprimer ' + category.label + ' ?')) {
      this.foodSvc.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories.set(this.categories().filter(c => c.id !== category.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }
}
