import { BookingService } from './../../service/bookings';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Ibooking } from '../../models/ibooking';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../service/theme-service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class BookingsComponent implements OnInit {
  bookings: Ibooking[] = [];
  filteredBookings: Ibooking[] = [];
  filterStartDate = '';
  filterEndDate = '';
  filterStatus = '';
  units: { id: string; title: string }[] = [];
  users: {id:string; email: string }[]=[];

     isDarkMode: boolean = false;
  // pagination
  currentPage = 1;
  pageSize = 7;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private BookingService: BookingService
        ) {
           this.themeService.darkMode$.subscribe(mode => {
            this.isDarkMode = mode;
          });
        }

  ngOnInit(): void {
    this.loadBookings();
    this.loadAds();
    this.loadUsers();
  }

  loadBookings() {
    this.BookingService.getBookings()
      .subscribe(data => {
        console.log(data);

        this.bookings = data.bookings;
        this.filteredBookings = data.bookings;
        this.cdr.detectChanges();
      });
  }

  loadAds() {
    this.http.get<{ id: string; title: string }[]>(`${environment.baseUrl}/listings`)
      .subscribe(data => {
        this.units = data;
        this.cdr.detectChanges();
        console.log('Bookings:', this.bookings);
      });
  }

    loadUsers() {
    this.http.get<{ id: string; email: string }[]>(`${environment.baseUrl}/users`)
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
        console.log('Users:', this.users);
      });
  }

  getAdTitle(unitId: string): string {
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.title : 'Unknown';
  }

   getUserEmail(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.email : 'Unknown';
  }

 applyFilters() {
  this.filteredBookings = this.bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt).getTime();

    const startDate = this.filterStartDate
      ? new Date(this.filterStartDate).getTime()
      : null;

    const endDate = this.filterEndDate
      ? new Date(this.filterEndDate).getTime()
      : null;

    const matchesDate =
      (!startDate || bookingDate >= startDate) &&
      (!endDate || bookingDate <= endDate);

    const matchesPaymentStatus =
      !this.filterStatus || booking.paymentStatus === this.filterStatus;

    return matchesDate && matchesPaymentStatus;
  });



    this.currentPage = 1; // ارجع لأول صفحة لما تتغير الفلاتر
  }

  resetFilters() {
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterStatus = '';
    this.filteredBookings = this.bookings;
    this.currentPage = 1;
  }

  // pagination helpers
  get paginatedBookings(): Ibooking[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredBookings.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBookings.length / this.pageSize);
  }

}
