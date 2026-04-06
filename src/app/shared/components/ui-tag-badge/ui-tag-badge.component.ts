import {
  Component, Input, Output, EventEmitter, computed, input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag }          from '../../../core/models';

@Component({
  selector: 'app-tag-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-tag-badge.component.html',
})
export class TagBadgeComponent {
  @Input({ required: true }) tag!: Tag;
  @Input() selected  = false;
  @Input() removable = false;
  @Input() disabled  = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() toggle = new EventEmitter<Tag>();
  @Output() remove = new EventEmitter<Tag>();

  get bgColor(): string {
    return this.tag.bgColor ?? this.hexToAlpha(this.tag.color, 0.12);
  }

  get textColor(): string {
    return this.tag.color;
  }

  get sizeClasses(): string {
    return {
      sm: 'px-1.5 py-0.5 text-2xs gap-1',
      md: 'px-2.5 py-1   text-xs   gap-1.5',
      lg: 'px-3   py-1.5 text-sm   gap-2',
    }[this.size];
  }

  onToggle(): void {
    if (!this.disabled) this.toggle.emit(this.tag);
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit(this.tag);
  }

  private hexToAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}