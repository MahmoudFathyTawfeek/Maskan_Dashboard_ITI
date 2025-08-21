import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Iuser } from '../../models/iuser';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { ThemeService } from '../../service/theme-service';
import { userService } from '../../service/user-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  http = inject(HttpClient);
  users: Iuser[] = [];
  filteredUsers: Iuser[] = [];
  loading = false;
  isDarkMode = false;
  currentPage = 1;
  pageSize = 10;

  searchEmail = '';
  searchError = '';

  totalHosts = 0;
  totalGuests = 0;
  occupancyRate = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private router: Router,
    private usersService:userService
  ) {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe(data => {

      this.users = data.data;
      this.filteredUsers = data.data;

      this.totalHosts = this.users.filter(u => u.role?.toLowerCase() === 'host').length;
      this.totalGuests = this.users.filter(u => u.role?.toLowerCase() === 'guest').length;

      const totalUsers = this.users.length;
      this.occupancyRate = totalUsers > 0 ? Math.round((this.totalHosts / totalUsers) * 100) : 0;

      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  get paginatedUsers(): Iuser[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredUsers.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${environment.baseUrl}/users/${id}`).subscribe(() => {
        this.users = this.users.filter(user => user._id !== id);
        this.filteredUsers = this.filteredUsers.filter(user => user._id !== id);
        alert('User deleted successfully');
        this.cdr.detectChanges();
      }, error => {
        alert('Failed to delete user');
        console.error(error);
      });
    }
  }

  editUser(id: string) {
    this.router.navigate(['/users/update', id]); // ← هنا هينقلك لصفحة تعديل المستخدم
  }

  searchByEmail() {
    this.searchError = '';
    const email = this.searchEmail.trim().toLowerCase();

    if (!email) {
      this.filteredUsers = this.users;
      this.currentPage = 1;
      return;
    }

    const foundUsers = this.users.filter(user => user.email.toLowerCase() === email);

    if (foundUsers.length > 0) {
      this.filteredUsers = foundUsers;
      this.currentPage = 1;
    } else {
      this.filteredUsers = [];
      this.searchError = 'This user e-mail not found';
    }
  }
}
