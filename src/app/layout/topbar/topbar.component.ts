import {
  Component, Input, Output, EventEmitter, signal
} from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterLink }          from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

interface Notification {
  id:     number;
  title:  string;
  desc:   string;
  time:   string;
  unread: boolean;
  type:   'info' | 'warning' | 'success';
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
toggleNotifications() {
throw new Error('Method not implemented.');
}
v: any;
toggleProfile() {
throw new Error('Method not implemented.');
}
  @Input() isDark           = false;
  @Input() sidebarCollapsed = false;

  @Output() toggleDark    = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  notifOpen   = signal(false);
  profileOpen = signal(false);
  searchFocus = signal(false);

  readonly notifications: Notification[] = [
    {
      id: 1,
      title: 'New hotels pending review',
      desc: '3 hotels submitted and awaiting approval.',
      time: '5 min ago',
      unread: true,
      type: 'warning',
    },
    {
      id: 2,
      title: 'Questionnaire milestone',
      desc: 'The questionnaire was completed 500 times today.',
      time: '1 hour ago',
      unread: true,
      type: 'success',
    },
    {
      id: 3,
      title: 'AI Engine report ready',
      desc: 'Monthly AI scoring report is available.',
      time: '3 hours ago',
      unread: false,
      type: 'info',
    },
    {
      id: 4,
      title: 'System maintenance scheduled',
      desc: 'Planned downtime on Sunday 02:00 – 04:00.',
      time: 'Yesterday',
      unread: false,
      type: 'warning',
    },
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  notifIconColor(type: Notification['type']): string {
    return {
      info:    'text-blue-500',
      warning: 'text-amber-500',
      success: 'text-emerald-500',
    }[type];
  }

  notifIconBg(type: Notification['type']): string {
    return {
      info:    'bg-blue-50 dark:bg-blue-950/40',
      warning: 'bg-amber-50 dark:bg-amber-950/40',
      success: 'bg-emerald-50 dark:bg-emerald-950/40',
    }[type];
  }

  notifSvg(type: Notification['type']): string {
    return {
      info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    }[type];
  }

  closeAll(): void {
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }
}