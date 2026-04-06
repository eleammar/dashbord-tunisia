import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() emoji       = '📭';
  @Input() title       = 'Aucun résultat';
  @Input() description = 'Il n\'y a rien à afficher pour le moment.';
  @Input() actionLabel?: string;
  @Input() secondaryLabel?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() action          = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  get sizeClasses(): Record<string, string> {
    return {
      sm: 'py-10',
      md: 'py-16',
      lg: 'py-24',
    };
  }

  get emojiSize(): string {
    return { sm: 'text-4xl', md: 'text-5xl', lg: 'text-6xl' }[this.size];
  }
}