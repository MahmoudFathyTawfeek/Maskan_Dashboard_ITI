import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { ICategory } from '../../models/icategory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  http = inject(HttpClient);
  categories: ICategory[] = [];
  isDarkMode = false;

  selectedCategory: ICategory = { _id: '', name: '', createdAt: new Date(), updatedAt: new Date() };

  loading = false;
  currentPage = 1;
  pageSize = 7;
  searchTerm = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.loading = true;
    this.http.get<ICategory[]>(`${environment.baseUrl}/categories`).subscribe(data => {
      this.categories = data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  get filteredCategories(): ICategory[] {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedCategories(): ICategory[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredCategories.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  selectCategory(category: ICategory) {
    this.selectedCategory = { ...category };
  }

  cancelEdit() {
    this.selectedCategory = { _id: '', name: '', createdAt: new Date(), updatedAt: new Date() };
  }

  saveCategory() {
    if (this.selectedCategory._id) {
      // ✅ تحديث
      this.http.put(`${environment.baseUrl}/categories/${this.selectedCategory._id}`, this.selectedCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.cancelEdit();
        });
    } else {
      // ✅ إضافة جديد
      this.http.post(`${environment.baseUrl}/categories`, this.selectedCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.cancelEdit();
        });
    }
  }

  deleteCategory(_id?: string) {
    if (!_id) return;
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${environment.baseUrl}/categories/${_id}`).subscribe(() => {
        this.fetchCategories();
      });
    }
  }
}
