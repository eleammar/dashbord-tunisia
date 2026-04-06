import {
  Component, Input, Output, EventEmitter,
  signal, computed, HostListener, ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Tag }          from '../../../core/models';
import { TagBadgeComponent } from '../ui-tag-badge/ui-tag-badge.component';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, TagBadgeComponent],
  templateUrl: './ui-multi-select.component.html',
})
export class MultiSelectComponent {
  @Input() label    = 'Sélectionner';
  @Input() options: Tag[] = [];
  @Input() selected: Tag[] = [];
  @Input() placeholder = 'Rechercher un tag...';
  @Input() maxDisplay  = 3;

  @Output() selectedChange = new EventEmitter<Tag[]>();

  private el = inject(ElementRef);

  isOpen       = signal(false);
  searchQuery  = signal('');

  readonly filteredOptions = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.options.filter(opt =>
      !q || opt.name.toLowerCase().includes(q)
    );
  });

  readonly displayedTags = computed(() =>
    this.selected.slice(0, this.maxDisplay)
  );

  readonly hiddenCount = computed(() =>
    Math.max(0, this.selected.length - this.maxDisplay)
  );

  toggle(): void { this.isOpen.update(v => !v); }

  isSelected(tag: Tag): boolean {
    return this.selected.some(s => s.id === tag.id);
  }

  toggleOption(tag: Tag): void {
    const next = this.isSelected(tag)
      ? this.selected.filter(s => s.id !== tag.id)
      : [...this.selected, tag];
    this.selectedChange.emit(next);
  }

  removeTag(tag: Tag): void {
    this.selectedChange.emit(this.selected.filter(s => s.id !== tag.id));
  }

  clearAll(): void {
    this.selectedChange.emit([]);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}