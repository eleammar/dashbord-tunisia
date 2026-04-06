import { Component, signal } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterLink }        from '@angular/router';
import { ScoreRingComponent } from '../../shared/components/ui-score-ring/ui-score-ring.component';

interface StatCard { label: string; value: string; change: number; svgPath: string; color: string; bg: string; }
interface BarData   { label: string; value: number; pct: number; color: string; }

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ScoreRingComponent],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent {
  period = signal<'7d' | '30d' | '90d'>('30d');

  readonly stats: StatCard[] = [
    { label:'Total Sessions',    value:'12,480', change:+18.2, bg:'bg-blue-50 dark:bg-blue-950/40',    color:'text-blue-600 dark:text-blue-400',    svgPath:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label:'Avg Session Time',  value:'4m 32s', change:+5.1,  bg:'bg-violet-50 dark:bg-violet-950/40', color:'text-violet-600 dark:text-violet-400', svgPath:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label:'Completion Rate',   value:'73%',    change:-2.3,  bg:'bg-amber-50 dark:bg-amber-950/40',   color:'text-amber-600 dark:text-amber-400',   svgPath:'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { label:'Recommendations',  value:'4,820',  change:+23.1, bg:'bg-emerald-50 dark:bg-emerald-950/40',color:'text-emerald-600 dark:text-emerald-400',svgPath:'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2' },
  ];

  readonly topCities: BarData[] = [
    { label:'Djerba',        value:1420, pct:100, color:'#2563eb' },
    { label:'Tunis',         value:1190, pct:84,  color:'#7c3aed' },
    { label:'Sousse',        value:870,  pct:61,  color:'#0891b2' },
    { label:'Hammamet',      value:640,  pct:45,  color:'#059669' },
    { label:'Sidi Bou Said', value:410,  pct:29,  color:'#d97706' },
  ];

  readonly topTags: BarData[] = [
    { label:'Beach',     value:890, pct:100, color:'#2563eb' },
    { label:'Culture',   value:740, pct:83,  color:'#7c3aed' },
    { label:'Adventure', value:620, pct:70,  color:'#d97706' },
    { label:'Food',      value:580, pct:65,  color:'#059669' },
    { label:'Desert',    value:440, pct:49,  color:'#dc2626' },
  ];

  readonly deviceData = [
    { label:'Mobile',  pct:58, color:'#2563eb' },
    { label:'Desktop', pct:31, color:'#7c3aed' },
    { label:'Tablet',  pct:11, color:'#0891b2' },
  ];

  formatChange(c: number): string { return `${c > 0 ? '+' : ''}${c}%`; }
}