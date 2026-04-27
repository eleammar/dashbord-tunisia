import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../../core/services/city.service';
import { CultureService } from '../../../core/services/culture.service';
import { EventService } from '../../../core/services/event.service';
import { FoodService } from '../../../core/services/food.service';
import { HotelService } from '../../../core/services/hotel.service';
import { ActivityService } from '../../../core/services/activity.service';
import { DelegationsService } from '../../../core/services/delegation.service';
import { AllFood } from '../../../core/models/food.model';

type FormTab =
  | 'general'
  | 'hero'
  | 'about'
  | 'culture'
  | 'events'
  | 'activities'
  | 'food'
  | 'hotels'
  | 'delegations'
  | 'banner'
  | 'nearby-cities'
  | 'preview';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-form.component.html',
})
export class CityFormComponent implements OnInit {
  private citySvc = inject(CityService);
  private cultureSvc = inject(CultureService);
  private eventSvc = inject(EventService);
  private foodSvc = inject(FoodService);
  private hotelSvc = inject(HotelService);
  private activitySvc = inject(ActivityService);
  private delegationSvc = inject(DelegationsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ── STATE ──────────────────────────────────────────────────
  isEdit = signal(false);
  saving = signal(false);
  loading = signal(true);
  activeTab = signal<FormTab>('general');
  cityId = signal<string | null>(null);

  // ── FORM DATA ──────────────────────────────────────────────
  name = signal('');
  region = signal<any>('Nord');
  mapSrc = signal('');
  mapCenterLat = signal(36.8065);
  mapCenterLng = signal(10.1815);
  mapZoom = signal(13);

  // Hero
  heroBg = signal('');
  heroDesc = signal('');
  heroCards = signal<any[]>([]);

  // About
  aboutLabel = signal('');
  aboutHeadline = signal('');
  aboutBody = signal('');
  aboutImg = signal('');
  aboutStats = signal<any[]>([]);

  // ALL AVAILABLE DATA FROM BACKEND
  allCultureItems = signal<any[]>([]);
  allEvents = signal<any[]>([]);
  allActivities = signal<any[]>([]);
  allFood = signal<AllFood[]>([]);
  allHotels = signal<any[]>([]);
  allDelegations = signal<any[]>([]);
  allNearbyCities = signal<any[]>([]);

  // SELECTED IDs FOR THIS CITY
  selectedCultureIds = signal<string[]>([]);
  selectedEventIds = signal<string[]>([]);
  selectedActivityIds = signal<string[]>([]);
  selectedFoodIds = signal<string[]>([]);
  selectedHotelIds = signal<string[]>([]);
  selectedDelegationIds = signal<string[]>([]);
  selectedNearbyCityIds = signal<string[]>([]);

  // Search filters
  cultureSearch = signal('');
  eventSearch = signal('');
  activitySearch = signal('');
  foodSearch = signal('');
  hotelSearch = signal('');
  delegationSearch = signal('');
  nearbySearch = signal('');

  // COMPUTED FILTERED LISTS
  filteredCulture = computed(() =>
    this.allCultureItems().filter((c) =>
      c.title.toLowerCase().includes(this.cultureSearch().toLowerCase())
    )
  );

  filteredEvents = computed(() =>
    this.allEvents().filter((e) =>
      e.name.toLowerCase().includes(this.eventSearch().toLowerCase())
    )
  );

  filteredActivities = computed(() =>
    this.allActivities().filter((a) =>
      a.name.toLowerCase().includes(this.activitySearch().toLowerCase())
    )
  );

  filteredFood = computed(() =>
    this.allFood().filter((f) =>
      f.name.toLowerCase().includes(this.foodSearch().toLowerCase())
    )
  );

  filteredHotels = computed(() =>
    this.allHotels().filter((h) =>
      h.n.toLowerCase().includes(this.hotelSearch().toLowerCase())
    )
  );

  filteredDelegations = computed(() =>
    this.allDelegations().filter((d) =>
      d.name.toLowerCase().includes(this.delegationSearch().toLowerCase())
    )
  );

  filteredNearbyCities = computed(() =>
    this.allNearbyCities()
      .filter((c) => c.region === this.region())
      .filter((c) => c.id !== this.cityId())
      .filter((c) =>
        c.name.toLowerCase().includes(this.nearbySearch().toLowerCase())
      )
  );

  // Banner
  bannerType = signal<'carousel' | 'video' | 'static'>('static');
  bannerTitle = signal('');
  bannerSubtitle = signal('');
  bannerCtaLabel = signal('');
  bannerCtaUrl = signal('');
  bannerVideoUrl = signal('');
  bannerImages = signal<string[]>([]);

  // CTA
  ctaLabel = signal('');
  ctaTitle = signal('');
  ctaDescription = signal('');
  ctaImage = signal('');

  readonly regions = [
    'Nord',
    'Nord-Est',
    'Nord-Ouest',
    'Centre',
    'Centre-Est',
    'Centre-Ouest',
    'Sud',
    'Sud-Est',
    'Sud-Ouest',
  ];

  readonly tabs: {
    key: FormTab;
    label: string;
    icon: string;
    count?: () => number;
  }[] = [
    {
      key: 'general',
      label: 'General',
      icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15h3m-3-6h3',
    },
    {
      key: 'hero',
      label: 'Hero',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      count: () => (this.heroBg() ? 1 : 0),
    },
    {
      key: 'about',
      label: 'About',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      count: () => (this.aboutHeadline() ? 1 : 0),
    },
    {
      key: 'culture',
      label: 'Culture',
      icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 7l9-4 9 4M4 10h16v11H4V10z',
      count: () => this.selectedCultureIds().length,
    },
    {
      key: 'events',
      label: 'Events',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      count: () => this.selectedEventIds().length,
    },
    {
      key: 'activities',
      label: 'Activities',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      count: () => this.selectedActivityIds().length,
    },
    {
      key: 'food',
      label: 'Food',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      count: () => this.selectedFoodIds().length,
    },
    {
      key: 'hotels',
      label: 'Hotels',
      icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      count: () => this.selectedHotelIds().length,
    },
    {
      key: 'delegations',
      label: 'Delegations',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
      count: () => this.selectedDelegationIds().length,
    },
    {
      key: 'banner',
      label: 'Banner & CTA',
      icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
      count: () => (this.bannerTitle() || this.ctaTitle() ? 1 : 0),
    },
    {
      key: 'nearby-cities',
      label: 'Nearby Cities',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
      count: () => this.selectedNearbyCityIds().length,
    },
    {
      key: 'preview',
      label: 'Preview',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit.set(true);
      this.cityId.set(id);
      this.loadCityData(id);
    } else {
      this._loadAllBackendData();
      this.loading.set(false);
    }
  }

  private deduplicateById<T extends { id?: string | number }>(items: T[]): T[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (item == null || item.id == null) return false;
      const id = String(item.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  private uniqueIds(ids: Array<string | number | null | undefined>): string[] {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const id of ids) {
      if (id == null) continue;
      const normalized = String(id);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      unique.push(normalized);
    }
    return unique;
  }

  private normalizeId(id: string | number | null | undefined): string | null {
    if (id == null) return null;
    return String(id);
  }

  // ═══════════════════════════════════════════════════════════════════
  // LOAD CITY DATA (edit mode)
  // In edit mode we use the city endpoint's own arrays as the available
  // lists so the UI shows only items that belong to this city.
  // ═══════════════════════════════════════════════════════════════════
  private loadCityData(id: string): void {
    this.loading.set(true);

    this.citySvc.getById(id).subscribe({
      next: () => {
        const city = this.citySvc.currentCity();
        if (city) {
          // 1. Populate available lists from city data FIRST
          this.allFood.set(this.deduplicateById(Array.isArray(city.food) ? city.food : []));
          this.allActivities.set(this.deduplicateById(Array.isArray(city.experiences) ? city.experiences : []));
          this.allEvents.set(this.deduplicateById(Array.isArray(city.events) ? city.events : []));
          this.allHotels.set(this.deduplicateById(Array.isArray(city.hotels) ? city.hotels : []));
          this.allDelegations.set(this.deduplicateById(Array.isArray(city.delegations) ? city.delegations : []));
          this.allCultureItems.set(this.deduplicateById(city.culture?.items ?? []));

          // 2. Fill form fields and selected IDs
          this._fillForm(city);

          // 3. Load only nearby cities (global list) — pass false so the
          //    city-specific lists set above are NOT overwritten.
          this._loadAllBackendData(false);
        } else {
          this._loadAllBackendData();
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading city:', err);
        this.loading.set(false);
        alert('Failed to load city');
        this.router.navigate(['/cities']);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // LOAD ALL BACKEND DATA
  // loadGlobal = true  → fetch & set all global lists (create mode)
  // loadGlobal = false → skip global lists, only load nearby cities
  //                      (edit mode — city-specific lists already set)
  // ═══════════════════════════════════════════════════════════════════
  private _loadAllBackendData(loadGlobal = true): void {
    if (loadGlobal) {
      this.cultureSvc.getAll().subscribe({
        next: (response: any) =>
          this.allCultureItems.set(this.deduplicateById(response.data ?? [])),
        error: (err) => console.error('Error loading culture:', err),
      });

      this.eventSvc.getAll().subscribe({
        next: (response: any) =>
          this.allEvents.set(this.deduplicateById(response.data ?? [])),
        error: (err) => console.error('Error loading events:', err),
      });

      this.activitySvc.getAll().subscribe({
        next: (response: any) =>
          this.allActivities.set(this.deduplicateById(response.data ?? [])),
        error: (err) => console.error('Error loading activities:', err),
      });

      // ✅ FIX: food subscription is INSIDE the loadGlobal guard.
      // In edit mode (loadGlobal = false) this block is skipped entirely,
      // so allFood keeps the city-specific data set in loadCityData().
      this.foodSvc.fetchAllFoods();
      this.foodSvc.allFoods$.subscribe((foods) => {
        this.allFood.set(this.deduplicateById(foods ?? []));
      });

      this.hotelSvc.getAll().subscribe({
        next: (response: any) =>
          this.allHotels.set(this.deduplicateById(response.data ?? [])),
        error: (err) => console.error('Error loading hotels:', err),
      });

      this.delegationSvc.getAll().subscribe({
        next: (response: any) =>
          this.allDelegations.set(this.deduplicateById(response.data ?? [])),
        error: (err) => console.error('Error loading delegations:', err),
      });
    }

    // Always load all cities for the "nearby cities" picker
    this.citySvc.getAll().subscribe({
      next: (response: any) => {
        const cities = Array.isArray(response) ? response : response.data || [];
        this.allNearbyCities.set(this.deduplicateById(cities));
      },
      error: (err) => console.error('Error loading cities:', err),
    });
  }

  private _fillForm(city: any): void {
    this.name.set(city.name);
    this.region.set(city.region);
    this.mapSrc.set(city.mapSrc);
    this.mapCenterLat.set(city.mapCenter[0]);
    this.mapCenterLng.set(city.mapCenter[1]);
    this.mapZoom.set(city.mapZoom);

    if (city.hero) {
      this.heroBg.set(city.hero.bg);
      this.heroDesc.set(city.hero.desc);
      this.heroCards.set(city.hero.cards);
    }

    if (city.about) {
      this.aboutLabel.set(city.about.label);
      this.aboutHeadline.set(city.about.headline);
      this.aboutBody.set(city.about.body);
      this.aboutImg.set(city.about.img);
      this.aboutStats.set(city.about.stats);
    }

    if (city.culture?.items) {
      this.selectedCultureIds.set(this.uniqueIds(city.culture.items.map((c: any) => c.id)));
    }

    if (city.events) {
      this.selectedEventIds.set(this.uniqueIds(city.events.map((e: any) => e.id)));
    }

    if (city.experiences) {
      this.selectedActivityIds.set(this.uniqueIds(city.experiences.map((a: any) => a.id)));
    }

    if (city.food) {
      if (Array.isArray(city.food) && city.food.length > 0 && typeof city.food[0] === 'object') {
        this.selectedFoodIds.set(this.uniqueIds(city.food.map((f: any) => f.id)));
      } else {
        this.selectedFoodIds.set(this.uniqueIds(city.food));
      }
    }

    if (city.hotels) {
      this.selectedHotelIds.set(this.uniqueIds(city.hotels.map((h: any) => h.id)));
    }

    if (city.delegations) {
      this.selectedDelegationIds.set(this.uniqueIds(city.delegations.map((d: any) => d.id)));
    }

    if (city.nearbyCities) {
      this.selectedNearbyCityIds.set(this.uniqueIds(city.nearbyCities.map((c: any) => c.id)));
    }

    if (city.banner) {
      this.bannerType.set(city.banner.type);
      this.bannerTitle.set(city.banner.title);
      this.bannerSubtitle.set(city.banner.subtitle);
      this.bannerCtaLabel.set(city.banner.ctaLabel);
      this.bannerCtaUrl.set(city.banner.ctaUrl);
      this.bannerVideoUrl.set(city.banner.videoUrl || '');
      this.bannerImages.set(city.banner.images || []);
    }

    if (city.cta) {
      this.ctaLabel.set(city.cta.label);
      this.ctaTitle.set(city.cta.title);
      this.ctaDescription.set(city.cta.description);
      this.ctaImage.set(city.cta.image);
    }
  }

  // ════════════════════════════════════════════════════════════
  // HERO CARDS HELPERS
  // ════════════════════════════════════════════════════════════

  addHeroCard(): void {
    this.heroCards.update((c) => [...c, { id: Date.now().toString(), img: '', name: '' }]);
  }

  removeHeroCard(i: number): void {
    this.heroCards.update((c) => c.filter((_, idx) => idx !== i));
  }

  updateHeroCardImg(i: number, value: string): void {
    this.heroCards.update((c) => { c[i].img = value; return [...c]; });
  }

  updateHeroCardName(i: number, value: string): void {
    this.heroCards.update((c) => { c[i].name = value; return [...c]; });
  }

  // ════════════════════════════════════════════════════════════
  // ABOUT STATS HELPERS
  // ════════════════════════════════════════════════════════════

  addAboutStat(): void {
    this.aboutStats.update((s) => [...s, { icon: '', num: '', label: '' }]);
  }

  removeAboutStat(i: number): void {
    this.aboutStats.update((s) => s.filter((_, idx) => idx !== i));
  }

  updateAboutStatIcon(i: number, value: string): void {
    this.aboutStats.update((s) => { s[i].icon = value; return [...s]; });
  }

  updateAboutStatNum(i: number, value: string): void {
    this.aboutStats.update((s) => { s[i].num = value; return [...s]; });
  }

  updateAboutStatLabel(i: number, value: string): void {
    this.aboutStats.update((s) => { s[i].label = value; return [...s]; });
  }

  // ════════════════════════════════════════════════════════════
  // BANNER IMAGES HELPERS
  // ════════════════════════════════════════════════════════════

  addBannerImage(): void {
    this.bannerImages.update((b) => [...b, '']);
  }

  removeBannerImage(i: number): void {
    this.bannerImages.update((b) => b.filter((_, idx) => idx !== i));
  }

  updateBannerImage(i: number, value: string): void {
    this.bannerImages.update((b) => { b[i] = value; return [...b]; });
  }

  // ════════════════════════════════════════════════════════════
  // SELECTION HELPERS
  // ════════════════════════════════════════════════════════════

  toggleItemSelection(
    signal: WritableSignal<string[]>,
    id: string | number | null | undefined
  ): void {
    const normalizedId = this.normalizeId(id);
    if (!normalizedId) return;
    signal.update((ids) => {
      const normalizedIds = this.uniqueIds(ids);
      return normalizedIds.includes(normalizedId)
        ? normalizedIds.filter((i) => i !== normalizedId)
        : [...normalizedIds, normalizedId];
    });
  }

  isItemSelected(
    signal: WritableSignal<string[]>,
    id: string | number | null | undefined
  ): boolean {
    const normalizedId = this.normalizeId(id);
    if (!normalizedId) return false;
    return this.uniqueIds(signal()).includes(normalizedId);
  }

  selectAllItems(signal: WritableSignal<string[]>, items: any[]): void {
    signal.set(this.uniqueIds(items.map((i) => this.normalizeId(i?.id))));
  }

  clearAllItems(signal: WritableSignal<string[]>): void {
    signal.set([]);
  }

  getSelectedItems<T extends { id: string | number }>(
    available: T[],
    selectedIds: string[]
  ): T[] {
    const selectedSet = new Set(this.uniqueIds(selectedIds));
    return this.deduplicateById(available).filter((item) =>
      selectedSet.has(String(item.id))
    );
  }

  // ════════════════════════════════════════════════════════════
  // VALIDATION & SUBMIT
  // ════════════════════════════════════════════════════════════

  isValid(): boolean {
    return this.name().trim().length > 0 && this.region().length > 0;
  }

  onSubmit(): void {
    if (!this.isValid()) {
      alert('Please fill in all required fields (Name, Region)');
      return;
    }

    this.saving.set(true);

    const cultureIds = this.uniqueIds(this.selectedCultureIds());
    const eventIds = this.uniqueIds(this.selectedEventIds());
    const activityIds = this.uniqueIds(this.selectedActivityIds());
    const foodIds = this.uniqueIds(this.selectedFoodIds());
    const hotelIds = this.uniqueIds(this.selectedHotelIds());
    const delegationIds = this.uniqueIds(this.selectedDelegationIds());
    const nearbyCityIds = this.uniqueIds(this.selectedNearbyCityIds());

    const formData: any = {
      name: this.name(),
      region: this.region(),
      mapSrc: this.mapSrc(),
      mapCenter: [this.mapCenterLat(), this.mapCenterLng()],
      mapZoom: this.mapZoom(),
      hero: {
        bg: this.heroBg(),
        desc: this.heroDesc(),
        cards: this.heroCards(),
      },
      about: {
        label: this.aboutLabel(),
        headline: this.aboutHeadline(),
        body: this.aboutBody(),
        img: this.aboutImg(),
        stats: this.aboutStats(),
      },
      culture: {
        items: this.getSelectedItems(this.allCultureItems(), cultureIds),
      },
      events: this.getSelectedItems(this.allEvents(), eventIds),
      experiences: this.getSelectedItems(this.allActivities(), activityIds),
      food: foodIds,
      hotels: this.getSelectedItems(this.allHotels(), hotelIds),
      delegations: this.getSelectedItems(this.allDelegations(), delegationIds),
      nearbyCities: this.getSelectedItems(this.allNearbyCities(), nearbyCityIds),
      cultureIds,
      eventIds,
      activityIds,
      foodIds,
      hotelIds,
      delegationIds,
      nearbyCityIds,
      banner: {
        type: this.bannerType(),
        title: this.bannerTitle(),
        subtitle: this.bannerSubtitle(),
        ctaLabel: this.bannerCtaLabel(),
        ctaUrl: this.bannerCtaUrl(),
        videoUrl: this.bannerVideoUrl(),
        images: this.bannerImages(),
      },
      cta: {
        label: this.ctaLabel(),
        title: this.ctaTitle(),
        description: this.ctaDescription(),
        image: this.ctaImage(),
      },
    };

    const id = this.cityId();

    if (id) {
      this.citySvc.update(id, formData).subscribe({
        next: () => {
          this.saving.set(false);
          alert('✓ City updated successfully!');
          this.router.navigate(['/cities', id]);
        },
        error: (err) => {
          this.saving.set(false);
          alert('✗ Error: ' + err.message);
        },
      });
    } else {
      this.citySvc.create(formData).subscribe({
        next: () => {
          this.saving.set(false);
          alert('✓ City created successfully!');
          this.router.navigate(['/cities']);
        },
        error: (err) => {
          this.saving.set(false);
          alert('✗ Error: ' + err.message);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cities']);
  }

  getFoodImageUrl(food: any): string {
    if (!food) return 'fallback-image-url';
    const url = food.imageUrl || food.image_url || food.image;
    if (!url) return 'fallback-image-url';
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  }
}