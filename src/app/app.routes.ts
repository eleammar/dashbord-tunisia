
import { Routes } from '@angular/router';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminShellComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
          icon: '🏠',
          breadcrumb: 'Dashboard',
        },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then(
            m => m.AnalyticsComponent
          ),
        data: {
          title: 'Analytics',
          icon: '📊',
          breadcrumb: 'Analytics',
        },
      },
      {
        path: 'cities',
        loadComponent: () =>
          import('./features/cities/cities-list/cities-list.component').then(
            m => m.CitiesListComponent
          ),
        data: { title: 'Villes', icon: '🏙️', breadcrumb: 'Villes' },
      },
      {
        path: 'cities/new',
        loadComponent: () =>
          import('./features/cities/city-form/city-form.component').then(
            m => m.CityFormComponent
          ),
        data: { title: 'New City', icon: '🏙️', breadcrumb: 'New City', mode: 'create' },
      },
      {
        path: 'cities/:id',
        loadComponent: () =>
          import('./features/cities/city-detail/city-detail.component').then(
            m => m.CityDetailComponent
          ),
        data: { title: 'City Detail', icon: '🏙️', breadcrumb: 'Detail' },
      },
      {
        path: 'cities/:id/edit',
        loadComponent: () =>
          import('./features/cities/city-form/city-form.component').then(
            m => m.CityFormComponent
          ),
        data: { title: 'Edit City', icon: '🏙️', breadcrumb: 'Edit', mode: 'edit' },
      },
      {
        path: 'activities',
        data: { title: 'Activités', icon: '🎯', breadcrumb: 'Activités' },
        loadComponent: () =>
          import('./features/activities/activities.component').then(
            m => m.ActivitiesComponent
          ),
      },
      {
        path: 'food',
        data: { title: 'Nourriture', icon: '🍕', breadcrumb: 'Nourriture' },
        loadComponent: () =>
          import('./features/food/food.component').then(
            m => m.FoodComponent
          ),
      },
      {
        path: 'food/add',
        data: { title: 'Ajouter un plat', breadcrumb: 'Ajouter' },
        loadComponent: () =>
          import('./features/food/food-form/food-form.component').then(
            m => m.FoodFormComponent
          ),
      },
      {
        path: 'food/:id/edit',
        data: { title: 'Modifier un plat', breadcrumb: 'Modifier' },
        loadComponent: () =>
          import('./features/food/food-form/food-form.component').then(
            m => m.FoodFormComponent
          ),
      },


            {
        path: 'food/popular/add',
        data: { title: 'Ajouter un plat populaire', breadcrumb: 'Ajouter' },
        loadComponent: () =>
          import('./features/food/popular-food-form/popular-food-form.component').then(
            m => m.PopularFoodFormComponent
          ),
      },
      {
        path: 'food/popular/:id/edit',
        data: { title: 'Modifier un plat populaire', breadcrumb: 'Modifier' },
        loadComponent: () =>
          import('./features/food/popular-food-form/popular-food-form.component').then(
            m => m.PopularFoodFormComponent
          ),
      },
      {
        path: 'hotels',
        data: { title: 'Hôtels', icon: '🏨', breadcrumb: 'Hôtels' },
        loadComponent: () =>
          import('./features/hotels/hotels.component').then(
            m => m.HotelsComponent
          ),
      },
      {
        path: 'events',
        data: { title: 'Événements', icon: '🎭', breadcrumb: 'Événements' },
        loadComponent: () =>
          import('./features/events/events.component').then(
            m => m.EventsComponent
          ),
      },
      {
        path: 'culture',
        data: { title: 'Culture', icon: '🏛️', breadcrumb: 'Culture' },
        loadComponent: () =>
          import('./features/culture/culture.component').then(
            m => m.CultureComponent
          ),
      },
      {
        path: 'tags',
        data: { title: 'Tags', icon: '🏷️', breadcrumb: 'Tags' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/tags/tags-manager/tags-manager.component').then(
                m => m.TagsManagerComponent
              ),
          },
          {
            path: 'analytics',
            loadComponent: () =>
              import('./features/tags/tag-analytics/tag-analytics.component').then(
                m => m.TagAnalyticsComponent
              ),
            data: { breadcrumb: 'Analytics' },
          },
        ],
      },
      {
        path: 'questionnaire',
        data: { title: 'Questionnaire', icon: '❓', breadcrumb: 'Questionnaire' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/questionnaire/questionnaire-list/questionnaire-list.component').then(
                m => m.QuestionnaireListComponent
              ),
          },
          {
            path: 'builder',
            loadComponent: () =>
              import('./features/questionnaire/question-builder/question-builder.component').then(
                m => m.QuestionBuilderComponent
              ),
            data: { breadcrumb: 'Question Builder' },
          },
          {
            path: 'mapper',
            loadComponent: () =>
              import('./features/questionnaire/choice-tag-mapper/choice-tag-mapper.component').then(
                m => m.ChoiceTagMapperComponent
              ),
            data: { breadcrumb: 'Choice-Tag Mapper' },
          },
        ],
      },
      {
        path: 'recommendation',
        data: { title: 'Moteur IA', icon: '🤖', breadcrumb: 'Moteur IA' },
        children: [
          {
            path: '',
            redirectTo: 'simulation',
            pathMatch: 'full',
          },
          {
            path: 'rules',
            loadComponent: () =>
              import('./features/recommendation/rules-engine/rules-engine.component').then(
                m => m.RulesEngineComponent
              ),
            data: { breadcrumb: 'Règles' },
          },
          {
            path: 'simulation',
            loadComponent: () =>
              import('./features/recommendation/simulation-studio/simulation-studio.component').then(
                m => m.SimulationStudioComponent
              ),
            data: { breadcrumb: 'Simulation Studio' },
          },
        ],
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            m => m.NotFoundComponent
          ),
        data: { breadcrumb: '404' },
      },
    ],
  },



  
];