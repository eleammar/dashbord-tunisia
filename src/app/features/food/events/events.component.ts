import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../core/services/food.service';
import { FoodEvent } from '../../../core/models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  private foodSvc = inject(FoodService);
  private router = inject(Router);
  events = signal<FoodEvent[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.foodSvc.fetchEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  addEvent() {
    this.router.navigate(['/food/events', 'add']);
  }

  editEvent(event: FoodEvent) {
    this.router.navigate(['/food/events', event.id, 'edit']);
  }

  deleteEvent(event: FoodEvent) {
    if (confirm('Supprimer ' + event.name + ' ?')) {
      this.foodSvc.deleteEvent(event.id).subscribe({
        next: () => {
          this.events.set(this.events().filter(e => e.id !== event.id));
        },
        error: () => alert('Erreur suppression')
      });
    }
  }
}
