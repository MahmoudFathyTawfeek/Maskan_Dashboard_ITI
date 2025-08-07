import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Ilisting } from '../../models/ilisting';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../service/theme-service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-listings',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './admin-listings.html',
  styleUrls: ['./admin-listings.css']
})
export class AdminListingsComponent implements OnInit {
  pendingListings: Ilisting[] = [];
  loading = false;

  // ✅ Toast + Rejection Modal
  showToast = false;
  toastMessage = '';
  showRejectionModal = false;
  rejectionReason = '';
  selectedListingId: string | null = null;
  isDarkMode: boolean = false;

  // ✅ Pagination
  currentPage = 1;
  pageSize = 6;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  ngOnInit(): void {
    this.getPendingListings();
  }

  getPendingListings(): void {
    this.loading = true;
    this.http.get<Ilisting[]>(`${environment.baseUrl}/listings?isApproved=false`)
      .subscribe({
        next: (data) => {
          this.pendingListings = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading listings:', err);
          this.loading = false;
        }
      });
  }

  // ✅ فتح نافذة سبب الرفض
  openRejectionModal(id: string): void {
    this.selectedListingId = id;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  // ✅ غلق النافذة بدون رفض
  closeRejectionModal(): void {
    this.showRejectionModal = false;
    this.selectedListingId = null;
    this.rejectionReason = '';
  }

  // ✅ إرسال الرفض مع السبب
  submitRejection(): void {
    if (!this.selectedListingId || !this.rejectionReason.trim()) return;

    const body = {
      isApproved: false,
      rejectionReason: this.rejectionReason.trim()
    };

    this.http.patch(`${environment.baseUrl}/listings/${this.selectedListingId}`, body)
      .subscribe({
        next: () => {
          this.pendingListings = this.pendingListings.filter(l => l.id !== this.selectedListingId);
          this.toastMessage = `Listing rejected: ${this.rejectionReason}`;
          this.showToastMessage();
          this.closeRejectionModal();
        },
        error: (err) => {
          console.error('Rejection failed:', err);
        }
      });
  }

  // ✅ الموافقة
  approveListing(id: string): void {
    this.http.patch(`${environment.baseUrl}/listings/${id}`, { isApproved: true })
      .subscribe({
        next: () => {
          this.pendingListings = this.pendingListings.filter(l => l.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Approval failed:', err);
        }
      });
  }

  // ✅ Toast
  showToastMessage(): void {
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }

  // ✅ Pagination logic
  get paginatedListings(): Ilisting[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.pendingListings.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.pendingListings.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }
}
