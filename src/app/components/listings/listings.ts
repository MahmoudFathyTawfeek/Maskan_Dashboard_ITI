import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Ilisting } from '../../models/ilisting';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './listings.html',
  styleUrls: ['./listings.css']
})
export class ListingsComponent implements OnInit {
  http = inject(HttpClient);
  listings: Ilisting[] = [];
  paginatedListings: Ilisting[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  users: {id:string; email: string; name:string }[]=[];
  loading = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading=true;
    this.http.get<Ilisting[]>(`${environment.baseUrl}/listings`).subscribe(data => {
      this.listings = data;
      this.totalPages = Math.ceil(this.listings.length / this.itemsPerPage);
      this.getPaginatedListings();
      this.cdr.detectChanges();
       this.loadUsers();
       this.loading=false;
      console.log(this.listings);
    });
  }
  loadUsers() {
    this.http.get<{ id: string; email: string, name: string }[]>(`${environment.baseUrl}/users`)
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
        console.log('Users:', this.users);
      });
  }
  getPaginatedListings() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedListings = this.listings.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPaginatedListings();
    }
  }
   getUserEmail(hostId: string): string {
    const user = this.users.find(u => u.id === hostId);
    return user ? user.email : 'Unknown';
  }

  deleteListing(id: number | string) {
    if (confirm('This ads will be delete')) {
      this.http.delete(`${environment.baseUrl}/listings/${id}`).subscribe(() => {
        this.listings = this.listings.filter(listing => listing.id !== id);
        this.totalPages = Math.ceil(this.listings.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        this.getPaginatedListings();
        alert('Deleted successfully');
      }, error => {
        alert('There is an error');
        console.error(error);
      });
    }
  }
}
