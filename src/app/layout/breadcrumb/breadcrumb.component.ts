import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith }  from 'rxjs/operators';
import { toSignal }          from '@angular/core/rxjs-interop';

interface Crumb { label: string; path: string; }

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav aria-label="Breadcrumb"
         class="flex items-center gap-1.5 text-sm min-w-0">
      <ng-container *ngFor="let crumb of crumbs(); let last = last; let first = first">

        <!-- Separator (not before first) -->
        <svg *ngIf="!first"
             class="w-3.5 h-3.5 flex-shrink-0 text-slate-300 dark:text-slate-700"
             fill="none" stroke="currentColor"
             viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5l7 7-7 7" />
        </svg>

        <!-- Link (not last) -->
        <a *ngIf="!last"
           [routerLink]="crumb.path"
           class="text-slate-400 dark:text-slate-500
                  hover:text-slate-600 dark:hover:text-slate-300
                  transition-colors duration-150 truncate max-w-[120px]
                  text-[13px]">
          {{ crumb.label }}
        </a>

        <!-- Current page (last) -->
        <span *ngIf="last"
              class="text-slate-700 dark:text-slate-200
                     font-medium truncate max-w-[160px]
                     text-[13px]">
          {{ crumb.label }}
        </span>

      </ng-container>
    </nav>
  `,
})
export class BreadcrumbComponent {
  private router = inject(Router);

  private readonly LABELS: Record<string, string> = {
    dashboard:       'Dashboard',
    analytics:       'Analytics',
    cities:          'Cities',
    activities:      'Activities',
    food:            'Food & Dining',
    hotels:          'Hotels',
    events:          'Events',
    culture:         'Culture',
    tags:            'Tag Manager',
    questionnaire:   'Questionnaire',
    recommendation:  'AI Engine',
    simulation:      'Simulation',
    rules:           'Rules',
    history:         'History',
    users:           'Users',
    settings:        'Settings',
    profile:         'Profile',
    new:             'New',
    edit:            'Edit',
    builder:         'Builder',
    choices:         'Tag Mapping',
    analytics_sub:   'Analytics',
    relations:       'Relations',
  };

  readonly crumbs = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const url   = this.router.url.split('?')[0];
        const parts = url.split('/').filter(Boolean);
        const result: Crumb[] = [{ label: 'Home', path: '/dashboard' }];
        let path = '';
        for (const part of parts) {
          path += `/${part}`;
          const isId = /^[a-f0-9\-]{8,}$/i.test(part) || /^\d+$/.test(part);
          const label = isId ? 'Detail' : (this.LABELS[part] ?? part);
          result.push({ label, path });
        }
        return result;
      })
    ),
    { initialValue: [{ label: 'Home', path: '/dashboard' }] }
  );
}