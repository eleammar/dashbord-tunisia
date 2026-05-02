import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../core/services/city.service';
import { GuideService } from '@core/services/guide.service';
import { CityGuide } from '@core/models/guide.model';
import { CityListItem } from '../../core/models/city.model';
import { HeroEditorComponent } from './hero-editor/hero-editor.component';
import { HeroCategoriesEditorComponent } from './hero-categories-editor/hero-categories-editor.component';
import { GuideCategoriesEditorComponent } from './guide-categories-editor/guide-categories-editor.component';
import { PlacesEditorComponent } from './places-editor/places-editor.component';
import { CircuitsEditorComponent } from './circuits-editor/circuits-editor.component';
import { LiveGuidesEditorComponent } from './live-guides-editor/live-guides-editor.component';

type Tab = 'hero' | 'hero-categories' | 'categories' | 'places' | 'circuits' | 'live-guides';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    HeroEditorComponent,
    HeroCategoriesEditorComponent,
    GuideCategoriesEditorComponent,
    PlacesEditorComponent,
    CircuitsEditorComponent,
    LiveGuidesEditorComponent,
  ],
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css'],
})
export class GuideComponent implements OnInit {
  private citySvc = inject(CityService);
  private guideSvc = inject(GuideService);

  cities = this.citySvc.cities;
  selectedCityId = signal<string>('');
  activeTab = signal<Tab>('hero');
  cityGuide = signal<CityGuide | null>(null);
  loading = signal(false);
  showCityDropdown = signal(false);

  readonly tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'hero',             label: 'Hero',            icon: '🖼️' },
    { key: 'hero-categories',  label: 'Hero Catégories', icon: '🏷️' },
    { key: 'categories',       label: 'Catégories',      icon: '🗂️' },
    { key: 'places',           label: 'Lieux',           icon: '📍' },
    { key: 'circuits',         label: 'Circuits',        icon: '🛤️' },
    { key: 'live-guides',      label: 'Guides Live',     icon: '👤' },
  ];

  readonly contentScore = computed(() => {
    const g = this.cityGuide();
    if (!g) return 0;
    let s = 0;
    if (g.hero) s += 20;
    s += Math.min((g.heroCategories?.length ?? 0) * 5, 20);
    s += Math.min((g.categories?.length ?? 0) * 3, 15);
    s += Math.min((g.places?.length ?? 0) * 3, 25);
    s += Math.min((g.circuits?.length ?? 0) * 5, 10);
    s += Math.min((g.liveGuides?.length ?? 0) * 2, 10);
    return Math.min(s, 100);
  });

  readonly scoreColor = computed(() => {
    const s = this.contentScore();
    if (s >= 80) return 'text-emerald-500';
    if (s >= 50) return 'text-amber-500';
    return 'text-red-400';
  });

  readonly scoreBg = computed(() => {
    const s = this.contentScore();
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-400';
    return 'bg-red-400';
  });

  readonly selectedCity = computed(() =>
    this.cities().find(c => c.id === this.selectedCityId()) ?? null
  );

  get numericCityId(): number | null {
    const id = parseInt(this.selectedCityId(), 10);
    return isNaN(id) ? null : id;
  }

  ngOnInit(): void {
    this.citySvc.getAll().subscribe();
  }

  selectCity(city: CityListItem): void {
    this.selectedCityId.set(city.id);
    this.showCityDropdown.set(false);
    const numId = parseInt(city.id, 10);
    if (!isNaN(numId)) this.loadGuide(numId);
  }

  private loadGuide(cityId: number): void {
    this.loading.set(true);
    this.guideSvc.getCityGuide(cityId).subscribe({
      next: (res) => { this.cityGuide.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  setTab(tab: Tab): void { this.activeTab.set(tab); }

  onGuideReload(): void {
    const id = parseInt(this.selectedCityId(), 10);
    if (!isNaN(id)) this.loadGuide(id);
  }
}
