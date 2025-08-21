import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  
import { environment } from '../../../environments/environment.development';
import { Icategories } from '../../models/icategories';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  http = inject(HttpClient);
  categories: Icategories[] = [];
  isDarkMode = false;

  selectedCategory: Icategories = { 
    _id: '', 
    name: '', 
    arName: '', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };

  loading = false;
  currentPage = 1;
  pageSize = 7;
  searchTerm = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  // 🟢 جلب كل الكاتيجوريز
  fetchCategories() {
    this.loading = true;
    this.http.get<Icategories[]>(`${environment.baseUrl}/categories`).subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching categories:', err);
        this.loading = false;
      }
    });
  }

  // 🟢 البحث
  get filteredCategories(): Icategories[] {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(c =>
      (c.name?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (c.arName?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  // 🟢 الباجينيشن
  get paginatedCategories(): Icategories[] {
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

  // 🟢 اختيار الكاتيجوري للتعديل
  selectCategory(category: Icategories) {
    this.selectedCategory = { ...category };
  }

  cancelEdit() {
    this.selectedCategory = { 
      _id: '', 
      name: '', 
      arName: '', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };
  }

  // 🟢 حفظ (إضافة أو تعديل)
  saveCategory() {
    if (this.selectedCategory._id) {
      // تحديث
      const updatedCategory = {
        name: this.selectedCategory.name,
        arName: this.selectedCategory.arName,
        updatedAt: new Date().toISOString()
      };
      this.http.put(`${environment.baseUrl}/categories/${this.selectedCategory._id}`, updatedCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.cancelEdit();
        });
    } else {
      // إضافة جديد
      const newCategory = { 
        name: this.selectedCategory.name,
        arName: this.selectedCategory.arName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.http.post(`${environment.baseUrl}/categories`, newCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.cancelEdit();
        });
    }
  }

  // 🟢 حذف
  deleteCategory(_id?: string) {
    if (!_id) return;
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${environment.baseUrl}/categories/${_id}`).subscribe(() => {
        this.fetchCategories();
      });
    }
  }
}
