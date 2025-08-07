import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Iunit } from '../../models/iunit';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { ThemeService } from '../../service/theme-service';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './product-cards.html',
  styleUrls: ['./product-cards.css']
})
export class UnitsComponent implements OnInit {
  http = inject(HttpClient);
  units: Iunit[] = [];
  loading=false;
  paginatedUnits: Iunit[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 1;
   isDarkMode: boolean = false;

  constructor(private cdr: ChangeDetectorRef,  private themeService: ThemeService
    ) {
       this.themeService.darkMode$.subscribe(mode => {
        this.isDarkMode = mode;
      });
    }
  ngOnInit(): void {
    this.loading=true;
    this.http.get<Iunit[]>(`${environment.baseUrl}/units`).subscribe((data) => {
      this.units = data;
      this.totalPages = Math.ceil(this.units.length / this.itemsPerPage);
      this.getPaginatedUnits();
      this.loading=false;
      this.cdr.detectChanges();
    });
  }

  getPaginatedUnits() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUnits = this.units.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPaginatedUnits();
    }
  }

  deleteunit(id: string) {
    if (confirm(`Unit ${id} will be deleted`)) {
      this.http.delete(`${environment.baseUrl}/units/${id}`).subscribe(() => {
        this.units = this.units.filter(unit => unit.id !== id);
        this.totalPages = Math.ceil(this.units.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
        this.getPaginatedUnits();
        this.cdr.detectChanges();
        alert(`Unit deleted successfully`);
      }, error => {
        alert(`Failed to delete unit ${id}`);
        console.error(error);
      });
    }
  }
}
