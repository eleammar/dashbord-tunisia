
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodListComponent } from './food-list/food-list.component';
import { PopularFoodComponent } from './popular-food/popular-food.component';
import { AllFoodComponent } from './all-food/all-food.component';
import { RegionsComponent } from './regions/regions.component';
import { EventsComponent } from './events/events.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    CommonModule,
    FoodListComponent,
    PopularFoodComponent,
    AllFoodComponent,
    RegionsComponent,
    EventsComponent,
    RestaurantsComponent,
    CategoriesComponent
  ],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
})
export class FoodComponent {}
