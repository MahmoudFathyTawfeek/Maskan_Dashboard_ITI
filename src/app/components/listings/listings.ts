import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../service/listing';
import { ThemeService } from '../../service/theme-service';
import { IListing } from '../../models/ilisting';

@Component({
  selector: 'app-listings',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './listings.html',
  styleUrls: ['./listings.css']
})
export class ListingsComponent implements OnInit {
  listings: IListing[] = [];
  filteredListings: IListing[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 1;
  pageSize = 8;
  isDarkMode = false;

  constructor(
    private listingService: ListingService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings() {
    this.loading = true;
    this.error = null;

    this.listingService.getApprovedListings().subscribe({
      next: (data) => {
        console.log('Listings data:', data); // للتأكد من البيانات
        this.listings = data.data;
        this.filteredListings = data.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading listings:', err);
        this.error = 'Failed to load listings. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get paginatedListings(): IListing[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredListings.slice(startIndex, startIndex + this.pageSize);
  }

  deleteListing(listingId: string) {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    this.listingService.deleteListing(listingId).subscribe({
      next: () => {
        this.listings = this.listings.filter(l => l._id !== listingId);
        this.filteredListings = this.filteredListings.filter(l => l._id !== listingId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete listing');
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredListings.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }
}
