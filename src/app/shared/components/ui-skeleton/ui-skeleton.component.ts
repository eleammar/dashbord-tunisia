import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

type SkeletonVariant = 'card' | 'table-row' | 'list-item' | 'text' | 'avatar' | 'badge' | 'custom';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-skeleton.component.html',
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'card';
  @Input() count    = 1;
  @Input() height?: string;
  @Input() width?:  string;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}