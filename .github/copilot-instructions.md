# Explore Tunisia App - AI Coding Agent Instructions

## Project Overview

**ExploreTunisiaApp** is an Angular 18 admin dashboard for managing Tunisian cultural content. It's a **standalone component-based** single-page application with server-side rendering (SSR) support, Tailwind CSS styling, and a modular admin interface.

### Key Tech Stack
- **Framework**: Angular 18 with standalone components (no NgModules)
- **Styling**: Tailwind CSS 3.4 + PostCSS with custom Tunisian color palette
- **Build**: Angular CLI with SSR/prerendering enabled
- **Testing**: Karma + Jasmine
- **UI Components**: Chart.js for analytics, Font Awesome icons

---

## Architecture

### Component Structure (Standalone Pattern)

All components are **standalone** - they declare their own imports rather than using shared modules:

```typescript
// Pattern for ALL components
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],  // Explicit imports required
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
})
export class ExampleComponent {}
```

**Key locations**:
- `src/app/admin/` - All admin dashboard components (cities, food, culture management)
- `src/app/app.routes.ts` - Lazy-loaded routes via dynamic imports
- `src/app/app.config.ts` - ProvideClientHydration for SSR support

### Routing Pattern

Routes use **lazy-loading with dynamic imports** for code-splitting:

```typescript
// From app.routes.ts - Pattern for ALL routes
{
  path: 'admin/cities',
  loadComponent: () => 
    import('./admin/cities-management/cities-management.component')
      .then((m) => m.CitiesManagementComponent),
}
```

### Data Architecture (Current: Mock Data)

Components currently use **hardcoded mock data** arrays defined in the component class:
- `CitiesManagementComponent.cities[]` - Cities data with emojis as image placeholders
- `FoodManagementComponent.foods[]` - Food items with status and tags
- `AdminDashboardComponentComponent.stats[]` - Dashboard metrics

**Note**: No HTTP service layer exists yet. When adding backend integration, create `src/app/services/` with injectable services using Angular's built-in HttpClient.

---

## Styling & Theme

### Custom Tailwind Color Palette

The app uses **Tunisian-inspired colors** defined in `tailwind.config.js`:

- **Mediterranean** (blue): `#1B6B93` - Primary/accent color (nav, buttons, links)
- **Terracotta** (rust): `#C84B31` - Secondary accent (food, tertiary actions)
- **Sand** (beige): `#C89348` - Tertiary accent (culture, backgrounds)
- **Gray** (slate) - Default text and UI elements

Use via Tailwind: `bg-mediterranean-500`, `text-terracotta-600`, etc.

### Component Classes

Custom component classes in `src/styles.css` (via `@layer components`):

```css
.btn-primary        /* Mediterranean blue button */
.btn-terracotta     /* Rust-colored button */
.card               /* Rounded shadow container, 2xl radius */
.input-field        /* Consistent form input styling */
.sidebar-link       /* Nav link with hover state */
.stat-card          /* Dashboard stat card */
.table-header       /* Table header row styling */
```

### Animation Pattern

Consistent fade-in on page load:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Conventions & Patterns

### 1. Component Naming
- File structure: `/component-name/component-name.component.{ts|html|css}`
- Class names: PascalCase with "Component" suffix
- Selector: `app-kebab-case`

### 2. Data Display Patterns
- **Management pages** (cities, food, culture): Dual view mode (table/cards)
  - Track `viewMode: 'table' | 'cards'` property
  - Use `*ngFor` with mock data arrays
  - Status badges: `'Published' | 'Draft'`

- **Add pages**: Form-based components (not yet implemented)

- **Dashboard**: Stats cards + charts + trending lists
  - Stats use `[ngClass]` for dynamic color assignment based on `stat.color` property
  - Charts placeholder: DIV-based bar chart using Tailwind height utilities

### 3. Icon System
- Font Awesome 6+ classes via `@fortawesome/fontawesome-free`
- Inline SVG icons for most UI (sourced from Heroicons style)
- Emoji fallbacks for content (cities: 🏛️, food: 🍲, culture: 🕌)

### 4. Forms & Inputs
- Use `input-field` class for consistency
- Placeholder text describes the input
- Focus state: `focus:ring-2 focus:ring-mediterranean-300`

---

## Development Workflow

### Build & Run

```bash
npm start           # Dev server (port 4200)
npm run build       # Production build with prerendering
npm test            # Unit tests via Karma
npm run watch       # Build in watch mode
```

### Key Files for Changes

- **Routes**: `src/app/app.routes.ts` (add new admin pages here)
- **Styles**: `src/styles.css` (global) + component `.css` files
- **Theme**: `tailwind.config.js` (color palette changes)
- **Config**: `angular.json` (build/SSR settings), `src/app/app.config.ts` (Angular config)

### SSR/Prerendering

App is configured with **prerendering enabled** (see `angular.json`):
- `server.ts` - Express server entry point
- `src/main.server.ts` - Server bootstrap
- Prerender routes must be discovered (currently just `/admin`)

---

## Common Tasks for AI Agents

### Adding a New Management Page (e.g., Hotels)

1. **Create component**:
   ```bash
   ng generate component admin/hotels-management
   ```

2. **Update routes** in `src/app/app.routes.ts`:
   ```typescript
   {
     path: 'hotels',
     loadComponent: () => import('./admin/hotels-management/hotels-management.component')
       .then((m) => m.HotelsManagementComponent),
   }
   ```

3. **Follow CitiesManagementComponent pattern**:
   - Import `CommonModule`, `RouterModule`
   - Define data array in component class
   - Use grid for cards or table for list view
   - Apply theme colors from Tailwind palette

4. **Add navigation** in `admin-layout` component (sidebar)

### Adding Backend Services

1. Create `src/app/services/cities.service.ts`:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class CitiesService {
     constructor(private http: HttpClient) {}
     getCities() { return this.http.get<City[]>('/api/cities'); }
   }
   ```

2. Inject in component:
   ```typescript
   export class CitiesManagementComponent implements OnInit {
     cities: City[] = [];
     constructor(private citiesService: CitiesService) {}
     ngOnInit() {
       this.citiesService.getCities().subscribe(data => this.cities = data);
     }
   }
   ```

3. Update component to use `OnInit` lifecycle hook (already imported in Angular core)

### Testing Pattern

Components use Karma + Jasmine. Example:
```typescript
describe('CitiesManagementComponent', () => {
  let component: CitiesManagementComponent;
  let fixture: ComponentFixture<CitiesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitiesManagementComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(CitiesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Project Constraints & Notes

- **No API integration yet** - all data is hardcoded mock arrays
- **No auth system** - admin section is unprotected
- **No service layer** - components manage their own state
- **Chart.js included** but not actively used (future analytics)
- **Prerendering enabled** but only `/admin` is discoverable
- **Component styles**: Each component has its own `.css` file; avoid global styles outside `src/styles.css`

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/app.routes.ts` | Main route configuration with lazy loading |
| `src/app/app.config.ts` | Angular providers (SSR hydration) |
| `src/styles.css` | Global styles + Tailwind layer components |
| `tailwind.config.js` | Theme customization (colors, shadows) |
| `src/app/admin/admin-layout/` | Main admin layout (sidebar, header) |
| `src/app/admin/*-management/` | Data management pages (table/cards view) |
| `angular.json` | Build config + SSR settings |

---

## Tips for AI Agents

1. **Always use standalone components** - never create NgModules
2. **Import CommonModule** in every component that uses `*ngIf`, `*ngFor`, or `[ngClass]`
3. **Check app.routes.ts** before adding new pages - routes must be registered there
4. **Follow the existing card/table pattern** for list views - it's well-established
5. **Use theme colors** from Tailwind config - don't hardcode colors
6. **Test components** in isolation with Karma before integrating
7. **Lazy-load routes** using dynamic imports for better performance
8. **Keep components stateless** where possible (currently true - no services yet)
