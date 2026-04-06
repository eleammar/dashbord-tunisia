import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      <label *ngIf="label" class="text-sm font-medium">{{ label }}</label>
      <div class="flex flex-wrap gap-1 p-2 border border-gray-300 rounded">
        <span *ngFor="let opt of selected" class="px-2 py-1 bg-blue-100 rounded text-sm flex items-center gap-1">
          {{ opt }}
          <button (click)="toggleOption(opt)" class="ml-1 hover:text-red-600">×</button>
        </span>
        <select (change)="onSelect($event)" class="border-0 outline-none flex-1 text-sm">
          <option value="">Sélectionner...</option>
          <option *ngFor="let opt of options" [value]="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
  `,
  styles: []
})
export class MultiSelectComponent {
  @Input() label = '';
  @Input() options: string[] = [];
  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value && !this.selected.includes(value)) {
      this.selected = [...this.selected, value];
      this.selectedChange.emit(this.selected);
    }
    (event.target as HTMLSelectElement).value = '';
  }

  toggleOption(opt: string) {
    this.selected = this.selected.filter(s => s !== opt);
    this.selectedChange.emit(this.selected);
  }
}
