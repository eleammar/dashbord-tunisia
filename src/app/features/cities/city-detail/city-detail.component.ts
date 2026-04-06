import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CityService } from '../../../core/services/city.service';
import { City } from '../../../core/models/city.model';

type DetailTab = 'overview' | 'culture' | 'events' | 'experiences' | 'food' | 'hotels';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './city-detail.component.html',
})
export class CityDetailComponent implements OnInit {
  private svc = inject(CityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  city = signal<City | null>(null);
  loading = signal(true);
  tab = signal<DetailTab>('overview');

  readonly tabs: { key: DetailTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'culture', label: 'Culture', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { key: 'events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key: 'experiences', label: 'Activities', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { key: 'food', label: 'Food', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { key: 'hotels', label: 'Hotels', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/cities']);
      return;
    }

    this.svc.getById(id).subscribe({
      next: () => {
        this.city.set(this.svc.currentCity());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading city:', err);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cities']);
  }
}