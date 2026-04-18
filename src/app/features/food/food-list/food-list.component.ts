import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../../core/services/food.service';
import { AllFood, FoodCategory } from '../../../core/models/food.model';

interface FilterState {
  search: string;
  category: string;
  sortBy: 'name' | 'category';
}

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './food-list.component.html',
})
export class FoodListComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);

  loading = signal(true);
  viewMode = signal<'grid' | 'table'>('grid');
  currentPage = signal(1);
  pageSize = signal(12);

  showDeleteModal = signal(false);
  deletingFoodId = signal<number | null>(null);
  deletingFoodName = signal('');

  foods = this.foodSvc.allFoods$;
  categories = this.foodSvc.categories$;

  filters = signal<FilterState>({
    search: '',
    category: '',
    sortBy: 'name',
  });

  filtered = computed(() => {
    // Filtering logic will be implemented in the template using async pipe
    return [];
  });

  ngOnInit(): void {
    this.foodSvc.fetchAllFoods().subscribe(() => {
      this.loading.set(false);
    });
    this.foodSvc.fetchCategories().subscribe();
  }

  setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    this.filters.update((f) => ({ ...f, [key]: value }));
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.filters.set({
      search: '',
      category: '',
      sortBy: 'name',
    });
    this.currentPage.set(1);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage.set(page);
    }
  }

  viewFood(id: number): void {
    this.router.navigate(['/food', id]);
  }

  editFood(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/food', id, 'edit']);
  }

  confirmDelete(id: number, name: string, event: Event): void {
    event.stopPropagation();
    this.deletingFoodId.set(id);
    this.deletingFoodName.set(name);
    this.showDeleteModal.set(true);
  }

  deleteFood(): void {
    const id = this.deletingFoodId();
    if (id) {
      this.foodSvc.deleteFood(id).subscribe({
        next: () => {
          this.showDeleteModal.set(false);
          alert('✓ Food deleted successfully!');
        },
        error: (err: { message: string }) => {
          alert('✗ Error deleting food: ' + err.message);
        },
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingFoodId.set(null);
    this.deletingFoodName.set('');
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showDeleteModal()) {
      this.cancelDelete();
    }
  }
}
