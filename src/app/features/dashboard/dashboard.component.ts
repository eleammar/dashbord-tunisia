import {
  Component, OnInit, inject, signal, computed
} from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterLink }          from '@angular/router';
import { TagService }          from '../../core/services/tag.service';
import { CityService }         from '../../core/services/city.service';
import { ActivityService }     from '../../core/services/activity.service';
import { HotelService }        from '../../core/services/hotel.service';
import { EventService }        from '../../core/services/event.service';
import { ScoreRingComponent }  from '../../shared/components/ui-score-ring/ui-score-ring.component';
import { SkeletonComponent }   from '../../shared/components/ui-skeleton/ui-skeleton.component';

// ── Interfaces locales ─────────────────────────────────────
interface KpiCard {
  label:    string;
  value:    string | number;
  change:   number;
  period:   string;
  svgPath:  string;
  colorBg:  string;
  colorIcon:string;
}

interface ActivityLog {
  id:      number;
  action:  string;
  entity:  string;
  user:    string;
  time:    string;
  type:    'create' | 'update' | 'delete' | 'publish';
}

interface QuickStat {
  label: string;
  value: number;
  max:   number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ScoreRingComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private tagService    = inject(TagService);
  private cityService   = inject(CityService);
  private activityService = inject(ActivityService);
  private hotelService  = inject(HotelService);
  private eventService  = inject(EventService);

  // ── Loading states ─────────────────────────────────────
  loading = signal(true);

  // ── Computed from services ─────────────────────────────
  readonly cities     = this.cityService.cities;


  // ── KPI Cards ──────────────────────────────────────────
  readonly kpiCards: KpiCard[] = [
    {
      label:     'Total Cities',
      value:     24,
      change:    +12.5,
      period:    'vs last month',
      svgPath:   'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      colorBg:   'bg-blue-50 dark:bg-blue-950/40',
      colorIcon: 'text-blue-600 dark:text-blue-400',
    },
    {
      label:     'Active Hotels',
      value:     187,
      change:    +8.2,
      period:    'vs last month',
      svgPath:   'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      colorBg:   'bg-indigo-50 dark:bg-indigo-950/40',
      colorIcon: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label:     'Recommendations',
      value:     '4,820',
      change:    +23.1,
      period:    'this month',
      svgPath:   'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2',
      colorBg:   'bg-violet-50 dark:bg-violet-950/40',
      colorIcon: 'text-violet-600 dark:text-violet-400',
    },
    {
      label:     'Satisfaction Rate',
      value:     '89%',
      change:    +3.4,
      period:    'vs last month',
      svgPath:   'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      colorBg:   'bg-emerald-50 dark:bg-emerald-950/40',
      colorIcon: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  // ── Recent activity log ────────────────────────────────
  readonly activityLog: ActivityLog[] = [
    { id: 1,  action: 'New city added',          entity: 'Hammamet',           user: 'Admin',    time: '2 min ago',   type: 'create'  },
    { id: 2,  action: 'Hotel updated',           entity: 'Djerba Dream Resort', user: 'Admin',   time: '15 min ago',  type: 'update'  },
    { id: 3,  action: 'Event published',         entity: 'Festival du Sahara', user: 'Admin',    time: '1 hour ago',  type: 'publish' },
    { id: 4,  action: 'Tag created',             entity: '#wellness',          user: 'Admin',    time: '2 hours ago', type: 'create'  },
    { id: 5,  action: 'Activity deleted',        entity: 'Old tour package',   user: 'Admin',    time: '3 hours ago', type: 'delete'  },
    { id: 6,  action: 'Questionnaire updated',   entity: 'v3 — Main flow',     user: 'Admin',    time: 'Yesterday',   type: 'update'  },
  ];

  // ── Quick stats (content coverage) ────────────────────
  readonly quickStats: QuickStat[] = [
    { label: 'Cities',      value: 24,  max: 30,  color: '#2563eb' },
    { label: 'Activities',  value: 148, max: 200, color: '#7c3aed' },
    { label: 'Hotels',      value: 187, max: 250, color: '#0891b2' },
    { label: 'Food',        value: 93,  max: 150, color: '#059669' },
    { label: 'Events',      value: 41,  max: 60,  color: '#d97706' },
    { label: 'Culture',     value: 56,  max: 80,  color: '#dc2626' },
  ];

  // ── Top cities (simulated) ─────────────────────────────
  readonly topCities = [
    { name: 'Tunis',         region: 'North-East', score: 92, hotels: 42, activities: 18 },
    { name: 'Djerba',        region: 'South-East', score: 88, hotels: 67, activities: 14 },
    { name: 'Sousse',        region: 'Centre-Est', score: 81, hotels: 38, activities: 11 },
    { name: 'Hammamet',      region: 'North-East', score: 79, hotels: 52, activities: 9  },
    { name: 'Sidi Bou Said', region: 'North-East', score: 74, hotels: 12, activities: 7  },
  ];

  // ── Monthly recommendations chart data ─────────────────
  readonly chartData = [
    { month: 'Jul', value: 210, height: 35  },
    { month: 'Aug', value: 380, height: 63  },
    { month: 'Sep', value: 290, height: 48  },
    { month: 'Oct', value: 510, height: 85  },
    { month: 'Nov', value: 420, height: 70  },
    { month: 'Dec', value: 360, height: 60  },
    { month: 'Jan', value: 490, height: 82  },
    { month: 'Feb', value: 580, height: 97  },
    { month: 'Mar', value: 620, height: 100 },
  ];

  readonly maxChart = computed(() =>
    Math.max(...this.chartData.map(d => d.value))
  );

  // ── AI engine score ────────────────────────────────────
  readonly engineScore  = signal(87);
  readonly tagCoverage  = signal(74);
  readonly mappedTags   = signal(52);
  readonly totalTagsCount = signal(70);

  ngOnInit(): void {
    // Simulate initial load
    setTimeout(() => this.loading.set(false), 800);

    // Load services data
    this.cityService.getAll().subscribe();
    
  }

  // ── Helpers ────────────────────────────────────────────
  activityBadgeClass(type: ActivityLog['type']): string {
    return {
      create:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
      update:  'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
      delete:  'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
      publish: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
    }[type];
  }

  activityDotClass(type: ActivityLog['type']): string {
    return {
      create:  'bg-emerald-500',
      update:  'bg-blue-500',
      delete:  'bg-red-500',
      publish: 'bg-violet-500',
    }[type];
  }

  scoreColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#2563eb';
    if (score >= 40) return '#d97706';
    return '#ef4444';
  }

  progressWidth(value: number, max: number): string {
    return `${Math.round((value / max) * 100)}%`;
  }

  formatChange(change: number): string {
    return `${change > 0 ? '+' : ''}${change}%`;
  }
}