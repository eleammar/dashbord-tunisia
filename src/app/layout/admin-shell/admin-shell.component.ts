import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule }              from '@angular/common';
import { RouterOutlet }              from '@angular/router';
import { SidebarComponent }          from '../sidebar/sidebar.component';
import { TopbarComponent }           from '../topbar/topbar.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  private platformId = inject(PLATFORM_ID);
  sidebarCollapsed = signal<boolean>(false);
  isDark           = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const theme   = localStorage.getItem('et-theme');
      const sidebar = localStorage.getItem('et-sidebar');

      if (theme   === 'dark')      this.isDark.set(true);
      if (sidebar === 'collapsed') this.sidebarCollapsed.set(true);
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.classList.toggle('dark', this.isDark());
        localStorage.setItem('et-theme', this.isDark() ? 'dark' : 'light');
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'et-sidebar',
        this.sidebarCollapsed() ? 'collapsed' : 'expanded'
      );
    }
  }

  toggleDark(): void { this.isDark.update(v => !v); }}