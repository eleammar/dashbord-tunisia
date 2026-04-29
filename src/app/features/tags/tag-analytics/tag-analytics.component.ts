import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TagService } from '../../../core/services/tag.service';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-tag-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tag-analytics.component.html',
  styleUrls: ['./tag-analytics.component.css'],
})
export class TagAnalyticsComponent implements OnInit {
  private tagSvc = inject(TagService);

  loading = signal(true);
  tags = signal<Tag[]>([]);

  // ── COMPUTED ──────────────────────────────────────────────
  totalTags = computed(() => this.tags().length);

  recentTags = computed(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return this.tags().filter(t =>
      t.created_at && new Date(t.created_at).getTime() > cutoff
    );
  });

  recentCount = computed(() => this.recentTags().length);

  lastWeekCount = computed(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.tags().filter(t =>
      t.created_at && new Date(t.created_at).getTime() > cutoff
    ).length;
  });

  newestTag = computed(() => {
    const withDate = this.tags().filter(t => t.created_at);
    if (!withDate.length) return null;
    return withDate.reduce((a, b) =>
      new Date(a.created_at!).getTime() > new Date(b.created_at!).getTime() ? a : b
    );
  });

  sortedByName = computed(() =>
    [...this.tags()].sort((a, b) => a.name.localeCompare(b.name))
  );

  sortedByNewest = computed(() =>
    [...this.tags()]
      .filter(t => t.created_at)
      .sort((a, b) =>
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      )
      .slice(0, 10)
  );

  // Group tags by first letter for an A–Z index
  alphaGroups = computed<{ letter: string; tags: Tag[] }[]>(() => {
    const map: Record<string, Tag[]> = {};
    this.sortedByName().forEach(t => {
      const letter = t.name[0]?.toUpperCase() ?? '#';
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, tags]) => ({ letter, tags }));
  });

  // ── LIFECYCLE ─────────────────────────────────────────────
  ngOnInit(): void {
    this.tagSvc.getAll().subscribe({
      next: (data) => {
        this.tags.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
