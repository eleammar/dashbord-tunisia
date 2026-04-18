import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { AllFood } from '../../../core/models/food.model';

@Component({
  selector: 'app-all-food',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-food.component.html',
  styleUrls: ['./all-food.component.css']
})
export class AllFoodComponent implements OnInit {
  @ViewChild('formAnchor') formAnchor?: ElementRef;
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  foods = signal<AllFood[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  showForm = signal(false);
  editData: Partial<AllFood> | undefined = undefined;

  ngOnInit(): void {
    this.foodSvc.fetchAllFoods().subscribe({
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
    this.router.navigate(['/food/add']);
  }

  editFood(food: AllFood) {
    this.router.navigate(['/food', food.id, 'edit']);
  }

  deleteFood(food: AllFood) {
    if (confirm('Supprimer ' + food.name + ' ?')) {
      this.foodSvc.deleteFood(food.id).subscribe({
        next: () => {
          this.foods.set(this.foods().filter(f => f.id !== food.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }

  closeForm(refresh = false) {
    this.showForm.set(false);
    this.editData = undefined;
    if (refresh) {
      this.loading.set(true);
      this.foodSvc.fetchAllFoods().subscribe({
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
  }
}
