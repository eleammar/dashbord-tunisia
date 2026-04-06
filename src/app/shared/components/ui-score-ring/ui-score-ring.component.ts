import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-score-ring.component.html',
})
export class ScoreRingComponent {
  @Input() score       = 0;
  @Input() size        = 80;
  @Input() strokeWidth = 6;
  @Input() label?:     string;
  @Input() animated    = true;

  get radius():       number { return (this.size - this.strokeWidth * 2) / 2; }
  get circumference():number { return 2 * Math.PI * this.radius; }
  get dashOffset():   number { return this.circumference * (1 - Math.min(this.score, 100) / 100); }
  get cx():           number { return this.size / 2; }
  get cy():           number { return this.size / 2; }

  get scoreColor(): string {
    if (this.score >= 80) return '#10b981';   // success green
    if (this.score >= 60) return '#00b0cc';   // primary blue
    if (this.score >= 40) return '#f5c21b';   // gold
    if (this.score >= 20) return '#e6713f';   // terra orange
    return '#ef4444';                          // danger red
  }

  get scoreLabel(): string {
    if (this.score >= 80) return 'Excellent';
    if (this.score >= 60) return 'Bon';
    if (this.score >= 40) return 'Moyen';
    return 'Faible';
  }

  get fontSize():      number { return this.size * 0.22; }
  get subFontSize():   number { return this.size * 0.13; }
}