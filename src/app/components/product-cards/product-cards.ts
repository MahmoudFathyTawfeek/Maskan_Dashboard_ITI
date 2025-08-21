import { AmenitiesService } from './../../service/amenities-service';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { IAmenity } from '../../models/iamenity';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './product-cards.html',
  styleUrls: ['./product-cards.css']
})
export class AmenitiesComponent implements OnInit {
  http = inject(HttpClient);
  amenities: IAmenity[] = [];
  isDarkMode = false;
  selectedAmenity: IAmenity = { _id: '', name: '', createdAt: new Date(), icon: '' };

  loading = false;
  currentPage = 1;
  pageSize = 7;
  searchTerm = '';

  constructor(private cdr: ChangeDetectorRef,private AmenitiesService:AmenitiesService) {}

  ngOnInit(): void {
    this.fetchAmenities();
  }

  fetchAmenities() {
    this.loading = true;
    this.AmenitiesService.getAmenities().subscribe(data => {
      console.log(data);

      this.amenities = data.data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  get filteredAmenities(): IAmenity[] {
    if (!this.searchTerm) return this.amenities;
    return this.amenities.filter(a =>
      a.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedAmenities(): IAmenity[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAmenities.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredAmenities.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  selectAmenity(amenity: IAmenity) {
    this.selectedAmenity = { ...amenity };
  }

  cancelEdit() {
    this.selectedAmenity = { _id: '', name: '', createdAt: new Date(), icon: '' };
  }

  saveAmenity() {
    if (this.selectedAmenity._id) {
      // تحديث
      this.http.put(`${environment.baseUrl}/amenities/${this.selectedAmenity._id}`, this.selectedAmenity)
        .subscribe(() => {
          this.fetchAmenities();
          this.cancelEdit();
        });
    } else {
      // إضافة جديد
      this.http.post(`${environment.baseUrl}/amenities`, this.selectedAmenity)
        .subscribe(() => {
          this.fetchAmenities();
          this.cancelEdit();
        });
    }
  }

  deleteAmenity(_id?: string) {
    if (!_id) return;
    if (confirm('Are you sure you want to delete this amenity?')) {
      this.http.delete(`${environment.baseUrl}/amenities/${_id}`).subscribe(() => {
        this.fetchAmenities();
      });
    }
  }
}
