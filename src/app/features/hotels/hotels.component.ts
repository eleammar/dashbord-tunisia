import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../core/services/hotel.service';
import { CityService } from '../../core/services/city.service';
import { Hotel } from '../../core/models/hotel.model';
import { CityListItem } from '../../core/models/city.model';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  cities: CityListItem[] = [];
  showModal = false;
  editMode = false;
  form: Partial<Hotel> = {};
  editingId: number | null = null;
  loading = false;
  selectedCity: string = '';
  searchTerm: string = '';

  constructor(private hotelService: HotelService, private cityService: CityService) {}

  ngOnInit() {
    this.fetchCities();
    this.fetchHotels();
  }

  fetchCities() {
    this.cityService.getAll().subscribe({
      next: (res: any) => {
        this.cities = res.data || [];
      },
      error: () => {
        this.cities = [];
      }
    });
  }

  fetchHotels() {
    this.loading = true;
    this.hotelService.getAll().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter(h => {
      const cityMatch = this.selectedCity ? String(h.city_id) === this.selectedCity : true;
      const searchMatch = this.searchTerm
        ? (h.name?.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      return cityMatch && searchMatch;
    });
  }

  onCityFilterChange(cityId: string) {
    this.selectedCity = cityId;
    this.applyFilters();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCity) count++;
    if (this.searchTerm && this.searchTerm.trim() !== '') count++;
    return count;
  }

  getCityName(cityId: number | string | null): string {
    if (!cityId) return '-';
    const city = this.cities.find(c => c.id == cityId);
    return city ? city.name : cityId?.toString();
  }

  openAddModal() {
    this.editMode = false;
    this.form = {};
    this.showModal = true;
    this.editingId = null;
  }

  openEditModal(hotel: Hotel) {
    this.editMode = true;
    this.form = { ...hotel };
    this.showModal = true;
    this.editingId = hotel.id;
  }

  closeModal() {
    this.showModal = false;
    this.form = {};
    this.editingId = null;
  }

  saveHotel() {
    if (this.form.city_id) {
      this.form.city_id = Number(this.form.city_id);
    }
    const payload: any = {
      city_id: this.form.city_id,
      name: this.form.name,
      distance: this.form.distance,
      img: this.form.img,
      rating: this.form.rating,
      price: this.form.price,
      display_order: this.form.display_order,
    };
    if (this.editMode && this.editingId != null) {
      this.hotelService.update(Number(this.editingId), payload).subscribe(() => {
        this.fetchHotels();
        this.closeModal();
      });
    } else {
      this.hotelService.create(payload).subscribe(() => {
        this.fetchHotels();
        this.closeModal();
      });
    }
  }

  deleteHotel(id: number | string) {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.delete(Number(id)).subscribe(() => {
        this.fetchHotels();
      });
    }
  }
}
