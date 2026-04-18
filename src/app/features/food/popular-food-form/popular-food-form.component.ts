import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { FileUrlPipe } from '../../../shared/pipes/file-url.pipe';
import { PopularFood } from '../../../core/models/food.model';

@Component({
  selector: 'app-popular-food-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUrlPipe],
  templateUrl: './popular-food-form.component.html',
  styleUrls: ['./popular-food-form.component.css']
})
export class PopularFoodFormComponent implements OnInit {
  form!: FormGroup;
  get ingredients(): FormControl[] {
    return (this.form.get('recipe.ingredients') as FormArray).controls as FormControl[];
  }
  get steps(): FormControl[] {
    return (this.form.get('recipe.steps') as FormArray).controls as FormControl[];
  }
  addIngredient() {
    (this.form.get('recipe.ingredients') as FormArray).push(new FormControl(''));
  }
  removeIngredient(i: number) {
    (this.form.get('recipe.ingredients') as FormArray).removeAt(i);
  }
  addStep() {
    (this.form.get('recipe.steps') as FormArray).push(new FormControl(''));
  }
  removeStep(i: number) {
    (this.form.get('recipe.steps') as FormArray).removeAt(i);
  }
  public imageFile: File | null = null;
  loading = false;
  error: string | null = null;
  isEdit = false;
  foodId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      city: ['', Validators.required],
      imageUrl: [''],
      recipe: this.fb.group({
        ingredients: this.fb.array([]),
        steps: this.fb.array([])
      })
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.foodId = +id;
        this.loading = true;
        this.foodService.getPopularById(+id).subscribe({
          next: (food: PopularFood) => {
            this.form.patchValue({
              name: food.name,
              description: food.description,
              category: food.category,
              city: food.city,
              imageUrl: food.imageUrl
            });
            if (food.recipe?.ingredients) {
              (this.form.get('recipe.ingredients') as FormArray).clear();
              food.recipe.ingredients.forEach((ing: string) => (this.form.get('recipe.ingredients') as FormArray).push(new FormControl(ing)));
            }
            if (food.recipe?.steps) {
              (this.form.get('recipe.steps') as FormArray).clear();
              food.recipe.steps.forEach((step: string) => (this.form.get('recipe.steps') as FormArray).push(new FormControl(step)));
            }
            this.loading = false;
          },
          error: () => {
            this.error = 'Erreur de chargement du plat';
            this.loading = false;
          }
        });
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const imageUrlCtrl = this.form.get('imageUrl');
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.form.patchValue({ imageUrl: '' });
      imageUrlCtrl?.disable();
    } else {
      this.imageFile = null;
      imageUrlCtrl?.enable();
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    let payload: any;
    if (this.imageFile) {
      payload = new FormData();
      payload.append('name', this.form.value.name);
      payload.append('description', this.form.value.description);
      payload.append('category', this.form.value.category);
      payload.append('city', this.form.value.city);
      payload.append('image', this.imageFile);
      if (this.form.value.imageUrl) {
        payload.append('imageUrl', this.form.value.imageUrl);
      }
      payload.append('recipe', JSON.stringify(this.form.value.recipe));
    } else {
      payload = {
        ...this.form.value,
        imageUrl: this.form.value.imageUrl || this.form.get('imageUrl')?.value
      };
    }
    if (this.isEdit && this.foodId) {
      this.foodService.updatePopular(this.foodId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/food']);
        },
        error: () => {
          this.error = 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.foodService.createPopular(payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/food']);
        },
        error: () => {
          this.error = 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }
}
