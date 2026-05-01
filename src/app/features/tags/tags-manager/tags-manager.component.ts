import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TagService } from '../../../core/services/tag.service';
import { Tag, EntityType, ENTITY_TYPES } from '../../../core/models/tag.model';

interface FilterState {
  search: string;
  sortBy: 'name' | 'newest';
}

@Component({
  selector: 'app-tags-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tags-manager.component.html',
  styleUrls: ['./tags-manager.component.css'],
})
export class TagsManagerComponent implements OnInit {
  private tagSvc = inject(TagService);

  // ── TABS ──────────────────────────────────────────────────
  activeTab = signal<'manage' | 'assign'>('manage');

  // ── TAG LIST STATE ────────────────────────────────────────
  loading = signal(true);
  saving = signal(false);
  viewMode = signal<'grid' | 'table'>('grid');
  currentPage = signal(1);
  readonly pageSize = 12;

  tags = signal<Tag[]>([]);
  filters = signal<FilterState>({ search: '', sortBy: 'name' });

  showDeleteModal = signal(false);
  deletingTagId = signal<number | null>(null);
  deletingTagName = signal('');

  showFormModal = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingTagId = signal<number | null>(null);
  formName = signal('');
  formError = signal('');

  // ── ASSIGN TAB STATE ──────────────────────────────────────
  readonly entityTypes = ENTITY_TYPES;

  selectedEntityType = signal<EntityType>('city');
  entityId = signal<number | string | null>(null);
  entityIdInput = signal('');

  entityList = signal<{ id: number | string; label: string }[]>([]);
  entityListLoading = signal(false);

  assignLoading = signal(false);
  assignSaving = signal(false);
  assignError = signal('');
  assignSuccess = signal('');

  entityCurrentTags = signal<Tag[]>([]);   // tags already on entity
  entityLoaded = signal(false);

  // search for available tags in assign panel
  assignSearch = signal('');

  // ── COMPUTED ─────────────────────────────────────────────────
  filtered = computed(() => {
    const f = this.filters();
    const raw = this.tags();
    let list = Array.isArray(raw) ? [...raw] : [];

    if (f.search) {
      const s = f.search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(s));
    }

    list.sort(f.sortBy === 'name'
      ? (a, b) => a.name.localeCompare(b.name)
      : (a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });

    return list;
  });

  paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize))
  );

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '…', total];
    if (cur >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '…', cur - 1, cur, cur + 1, '…', total];
  });

  isSearchActive = computed(() => !!this.filters().search);
  totalTagsCount = computed(() => this.tags().length);
  filteredCount = computed(() => this.filtered().length);

  recentCount = computed(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return this.tags().filter(t =>
      t.created_at && new Date(t.created_at).getTime() > cutoff
    ).length;
  });

  // Available tags = all tags minus entity's current tags
  availableTags = computed(() => {
    const currentIds = new Set(this.entityCurrentTags().map(t => t.id));
    const search = this.assignSearch().toLowerCase();
    return this.tags().filter(t =>
      !currentIds.has(t.id) &&
      (!search || t.name.toLowerCase().includes(search))
    );
  });

  // ── LIFECYCLE ─────────────────────────────────────────────
  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.loading.set(true);
    this.tagSvc.getAll().subscribe({
      next: (data) => {
        this.tags.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // ── FILTER HELPERS ─────────────────────────────────────────
  setSearch(value: string): void {
    this.filters.update(f => ({ ...f, search: value }));
    this.currentPage.set(1);
  }

  setSortBy(value: 'name' | 'newest'): void {
    this.filters.update(f => ({ ...f, sortBy: value }));
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.filters.update(f => ({ ...f, search: '' }));
    this.currentPage.set(1);
  }

  // ── PAGINATION ────────────────────────────────────────────
  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // ── FORM MODAL ────────────────────────────────────────────
  openCreateModal(): void {
    this.formMode.set('create');
    this.editingTagId.set(null);
    this.formName.set('');
    this.formError.set('');
    this.showFormModal.set(true);
  }

  openEditModal(tag: Tag, event: Event): void {
    event.stopPropagation();
    this.formMode.set('edit');
    this.editingTagId.set(tag.id);
    this.formName.set(tag.name);
    this.formError.set('');
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
  }

  submitForm(): void {
    const name = this.formName().trim();
    if (!name) { this.formError.set('Tag name is required.'); return; }

    this.saving.set(true);
    this.formError.set('');

    const req = this.formMode() === 'create'
      ? this.tagSvc.create(name)
      : this.tagSvc.update(this.editingTagId()!, name);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.showFormModal.set(false);
        this.loadTags();
      },
      error: (err: { message: string }) => {
        this.saving.set(false);
        this.formError.set('Error: ' + err.message);
      },
    });
  }

  // ── DELETE ────────────────────────────────────────────────
  confirmDelete(id: number, name: string, event: Event): void {
    event.stopPropagation();
    this.deletingTagId.set(id);
    this.deletingTagName.set(name);
    this.showDeleteModal.set(true);
  }

  deleteTag(): void {
    const id = this.deletingTagId();
    if (id !== null) {
      this.tagSvc.delete(id).subscribe({
        next: () => {
          this.showDeleteModal.set(false);
          this.loadTags();
        },
        error: (err: { message: string }) => alert('Error: ' + err.message),
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingTagId.set(null);
    this.deletingTagName.set('');
  }

  // ── ASSIGN TAB LOGIC ──────────────────────────────────────
  switchToAssign(): void {
    this.activeTab.set('assign');
    this.resetAssignPanel();
    this.entityList.set([]);
    this.loadEntityList(this.selectedEntityType());
  }

  switchToManage(): void {
    this.activeTab.set('manage');
  }

  resetAssignPanel(): void {
    this.entityId.set(null);
    this.entityIdInput.set('');
    this.entityCurrentTags.set([]);
    this.entityLoaded.set(false);
    this.assignError.set('');
    this.assignSuccess.set('');
    this.assignSearch.set('');
  }

  onEntityTypeChange(type: string): void {
    this.selectedEntityType.set(type as EntityType);
    this.resetAssignPanel();
    this.entityList.set([]);
    this.loadEntityList(type as EntityType);
  }

  loadEntityList(type: EntityType): void {
    this.entityListLoading.set(true);
    this.tagSvc.getEntityList(type).subscribe({
      next: list => {
        this.entityList.set(list);
        this.entityListLoading.set(false);
      },
      error: () => this.entityListLoading.set(false),
    });
  }

  loadEntityTags(): void {
    const raw = (this.entityIdInput() ?? '').trim();
    if (!raw) {
      this.assignError.set('Veuillez sélectionner une entité.');
      return;
    }

    const stringIdTypes: EntityType[] = ['city', 'option'];
    const id: number | string = stringIdTypes.includes(this.selectedEntityType())
      ? raw
      : parseInt(raw, 10);

    this.entityId.set(id);
    this.assignLoading.set(true);
    this.assignError.set('');
    this.assignSuccess.set('');
    this.entityLoaded.set(false);

    this.tagSvc.getEntityTags(this.selectedEntityType(), id).subscribe({
      next: (tags) => {
        this.entityCurrentTags.set(Array.isArray(tags) ? tags : []);
        this.entityLoaded.set(true);
        this.assignLoading.set(false);
      },
      error: (err: { message: string }) => {
        this.assignError.set('Failed to load: ' + err.message);
        this.assignLoading.set(false);
      },
    });
  }

  addTagToEntity(tag: Tag): void {
    const id = this.entityId();
    if (id === null) return;

    this.assignSaving.set(true);
    this.assignSuccess.set('');
    this.assignError.set('');

    this.tagSvc.assignTags(this.selectedEntityType(), id, [tag.id]).subscribe({
      next: () => {
        this.entityCurrentTags.update(list => [...list, tag]);
        this.assignSaving.set(false);
        this.assignSuccess.set(`"${tag.name}" added.`);
        setTimeout(() => this.assignSuccess.set(''), 2500);
      },
      error: (err: { message: string }) => {
        this.assignError.set('Error: ' + err.message);
        this.assignSaving.set(false);
      },
    });
  }

  removeTagFromEntity(tag: Tag): void {
    const id = this.entityId();
    if (id === null) return;

    this.assignSaving.set(true);
    this.assignSuccess.set('');
    this.assignError.set('');

    this.tagSvc.removeTag(this.selectedEntityType(), id, tag.id).subscribe({
      next: () => {
        this.entityCurrentTags.update(list => list.filter(t => t.id !== tag.id));
        this.assignSaving.set(false);
        this.assignSuccess.set(`"${tag.name}" removed.`);
        setTimeout(() => this.assignSuccess.set(''), 2500);
      },
      error: (err: { message: string }) => {
        this.assignError.set('Error: ' + err.message);
        this.assignSaving.set(false);
      },
    });
  }

  // ── EXPORT ────────────────────────────────────────────────
  exportCsv(): void {
    const headers = ['ID', 'Name', 'Created At'];
    const rows = this.filtered().map(t =>
      [t.id, `"${t.name}"`, t.created_at ?? ''].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `tags-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showDeleteModal()) this.cancelDelete();
    else if (this.showFormModal()) this.closeFormModal();
  }
}
