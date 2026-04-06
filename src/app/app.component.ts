// ═══════════════════════════════════════════════════════════
//  APP COMPONENT — Explorer Tunisia Admin
//  Point d'entrée racine — standalone
// ═══════════════════════════════════════════════════════════

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}