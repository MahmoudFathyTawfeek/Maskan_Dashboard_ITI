import { AmenitiesService } from './../../service/amenities-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IListing } from '../../models/ilisting';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../service/listing';

interface IAmenity { _id: string; name: string; }

@Component({
  selector: 'app-listings-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-listings.html',
  styleUrls: ['./admin-listings.css']
})
export class AdminListingsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private listingsService: ListingService,
    private AmenitiesService:AmenitiesService
  ) {}

  loading = false;
  pendingListings: IListing[] = [];
  paginatedListings: IListing[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  showToast = false;
  toastMessage = '';
  showRejectionModal = false;
  rejectionReason = '';
  selectedListingId: string | null = null;
  isDarkMode = false;

  amenities: IAmenity[] = [];

  ngOnInit(): void {
    this.loading = true;

    // جلب amenities
    this.AmenitiesService.getAmenities()
      .subscribe(data => {
        console.log(data);

        this.amenities = data;
      });

    // جلب الليستنج اللي في انتظار الموافقة
    this.listingsService.getNotApprovedListings()
      .subscribe(data => {
        console.log(data);

        this.pendingListings = data.data;
        this.totalPages = Math.ceil(this.pendingListings.length / this.itemsPerPage);
        this.getPaginatedListings();
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  getPaginatedListings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedListings = this.pendingListings.slice(start, end);
    this.cdr.detectChanges();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPaginatedListings();
      this.cdr.detectChanges();
    }
  }

  getAmenityName(id: string): string {
    const amenity = this.amenities.find(a => a._id === id);
    return amenity ? amenity.name : id;
  }

  approveListing(id: string) {
    this.http.put(`${environment.baseUrl}/pending-listings/${id}/approve`, {}).subscribe(() => {
      this.toastMessage = 'Listing approved!';
      this.showToast = true;
      this.pendingListings = this.pendingListings.filter(l => l._id !== id);
      this.totalPages = Math.ceil(this.pendingListings.length / this.itemsPerPage);
      this.getPaginatedListings();
      setTimeout(() => this.showToast = false, 2000);
    });
  }

  openRejectionModal(id: string) {
    this.selectedListingId = id;
    this.showRejectionModal = true;
  }

  closeRejectionModal() {
    this.showRejectionModal = false;
    this.rejectionReason = '';
    this.selectedListingId = null;
  }

  submitRejection() {
    if (!this.selectedListingId) return;
    this.http.put(`${environment.baseUrl}/pending-listings/${this.selectedListingId}/reject`, {
      rejectionReason: this.rejectionReason
    }).subscribe(() => {
      this.toastMessage = 'Listing rejected!';
      this.showToast = true;
      this.pendingListings = this.pendingListings.filter(l => l._id !== this.selectedListingId);
      this.totalPages = Math.ceil(this.pendingListings.length / this.itemsPerPage);
      this.getPaginatedListings();
      this.closeRejectionModal();
      setTimeout(() => this.showToast = false, 2000);
    });
  }

  hideToast() { this.showToast = false; }
}
