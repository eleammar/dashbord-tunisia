# Explore Tunisia App - Architecture Overview

## Project Structure

Cette application suit une architecture modulaire et scalable avec Angular 18 standalone components.

### Core Module (`src/app/core/`)
Services centralisés et logique métier:

- **Interceptors**: HTTP interceptors pour l'authentification et le chargement
  - `auth.interceptor.ts` - Ajoute le token Bearer aux requêtes
  - `loading.interceptor.ts` - Gère l'indicateur de chargement

- **Guards**: Protection des routes
  - `auth.guard.ts` - Vérifie l'authentification avant d'accéder aux routes

- **Services**: Services métier
  - `api.service.ts` - Service HTTP générique pour les appels API
  - `notification.service.ts` - Notifications utilisateur (toast, alerts)
  - `theme.service.ts` - Gestion du thème (light/dark)

- **Models**: Interfaces TypeScript
  - `city.model.ts`, `activity.model.ts`, `hotel.model.ts`, etc.

- **State**: Gestion d'état simple
  - `app.state.ts` - Définition de l'état applicatif
  - `app.store.ts` - Store réactif avec signals Angular

### Shared Module (`src/app/shared/`)
Composants, pipes et utilities réutilisables:

#### Components
- `sidebar/` - Navigation latérale
- `topbar/` - Barre supérieure
- `data-table/` - Tableau de données générique
- `modal/`, `drawer/`, `confirm-dialog/` - Modales et dialogues
- `breadcrumb/`, `page-header/` - Navigation et entête
- `tag-input/`, `image-upload/` - Composants de formulaire
- `skeleton/`, `empty-state/`, `score-badge/` - UI utilities

#### Directives
- `tooltip.directive.ts` - Tooltips
- `click-outside.directive.ts` - Détecte les clics en dehors

#### Pipes
- `truncate.pipe.ts` - Tronque le texte
- `tag-color.pipe.ts` - Couleurs pour les tags

#### Utils
- `form.utils.ts` - Validation de formulaires
- `color.utils.ts` - Utilitaires pour les couleurs

### Features Module (`src/app/features/`)
Pages et logique spécifique aux domaines:

#### Dashboard (`dashboard/`)
- `dashboard.component` - Page d'accueil
- `dashboard.routes.ts` - Routes du dashboard

#### Cities (`cities/`)
- **Pages**: `city-list/`, `city-detail/`, `city-form/`
- **Components**: `city-card/`, `city-map-preview/`, `city-stats/`
- **Services**: `cities.service.ts`
- `cities.routes.ts` - Routes des villes

#### Activities, Hotels, Food, Events, Culture
Structure similaire avec pages et services respectifs

#### Tags (`tags/`)
- **Pages**: `tag-list/`, `tag-heatmap/`
- Gestion des tags et visualisation

#### Questionnaire (`questionnaire/`)
- **Pages**: `question-list/`, `question-builder/`, `questionnaire-preview/`
- Création et gestion des questionnaires

#### Recommendations (`recommendations/`)
- **Pages**: `recommendation-list/`, `recommendation-simulator/`
- Moteur de recommandations

#### Analytics (`analytics/`)
- **Pages**: `analytics-dashboard/`
- Tableaux de bord analytiques

### Layouts (`src/app/layouts/`)
Layouts principaux:
- `admin-layout/` - Layout avec sidebar et topbar pour l'admin
- `auth-layout/` - Layout pour les pages d'authentification

### Environments (`src/environments/`)
Configuration par environnement:
- `environment.ts` - Développement
- `environment.prod.ts` - Production

### Styles (`src/styles/`)
Styles globaux:
- `tailwind.css` - Configuration Tailwind CSS
- `globals.css` - Styles globaux applicatifs

## Conventions

### Naming
- **Composants**: `app-kebab-case.component.ts`
- **Services**: `service-name.service.ts`
- **Models/Interfaces**: `entity-name.model.ts`
- **Pipes**: `pipe-name.pipe.ts`
- **Directives**: `directive-name.directive.ts`

### Structure des Composants
Tous les composants sont **standalone** et déclarent leurs imports:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {}
```

### Routing
Utilisation du lazy-loading avec imports dynamiques:

```typescript
{
  path: 'cities',
  loadComponent: () => 
    import('./cities/cities.component')
      .then(m => m.CitiesComponent)
}
```

## Services et API

### ApiService
Service générique pour les appels HTTP:

```typescript
constructor(private api: ApiService) {}

// GET
this.api.get<City[]>('/cities')

// POST
this.api.post<City>('/cities', newCity)

// PUT
this.api.put<City>('/cities/1', updatedCity)

// DELETE
this.api.delete<void>('/cities/1')
```

### Feature Services
Chaque feature a un service qui utilise ApiService:

```typescript
export class CitiesService {
  constructor(private api: ApiService) {}
  
  getCities(): Observable<City[]> {
    return this.api.get<City[]>('/cities');
  }
}
```

## State Management

État applicatif simple utilisant les signals Angular:

```typescript
constructor(private store: AppStore) {}

// Accès à l'état
this.store.state$().theme // Accès au thème
this.store.setLoading(true) // Mise à jour
```

## Prochaines Étapes

1. **Intégration Backend**: Connecter l'API réelle dans les services
2. **Authentication**: Implémenter le système d'authentification
3. **Validation**: Ajouter des validateurs de formulaires
4. **Tests**: Écrire des tests unitaires et d'intégration
5. **i18n**: Support multilingue (arabe, français, anglais)
6. **Performance**: Optimisations et lazy-loading des images

## Configuration de Build

```bash
# Démarrage du serveur
npm start

# Build production
npm run build

# Tests
npm test

# Linting
npm run lint
```

## Dépendances Principales

- **Angular 18**: Framework principal
- **Tailwind CSS 3.4**: Styling
- **Chart.js**: Visualisations
- **RxJS**: Programmation réactive
- **TypeScript**: Typage statique

