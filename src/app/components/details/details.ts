import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Iunit } from '../../models/iunit';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class UnitDetailsComponent implements OnInit {
  currentId: string = '';
  unit?: Iunit;
  allIds: string[] = [];
  myIndex: number = -1;

  constructor(
    private route: Router,
    private active: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.active.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = id;

        // تحميل بيانات الوحدة الحالية
        this.http.get<Iunit>(`${environment.baseUrl}/units/${this.currentId}`).subscribe(data => {
          if (data) {
            this.unit = data;
            this.cdr.detectChanges(); // تحديث الـ UI يدويًا
          } else {
            this.route.navigate(['**']); // لو مفيش وحدة
          }
        });
      }

      // تحميل كل الـ IDs
      this.http.get<Iunit[]>(`${environment.baseUrl}/units`).subscribe(units => {
        this.allIds = units.map(u => u.id);
      });
    });
  }

  prev() {
    this.myIndex = this.allIds.indexOf(this.currentId);
    if (this.myIndex > 0) {
      const prevId = this.allIds[this.myIndex - 1];
      this.route.navigate(['/units', prevId]);
    }
  }

  next() {
    this.myIndex = this.allIds.indexOf(this.currentId);
    if (this.myIndex < this.allIds.length - 1) {
      const nextId = this.allIds[this.myIndex + 1];
      this.route.navigate(['/units', nextId]);
    }
  }

  goBack() {
    this.route.navigate(['/units']);
  }

  // أمثلة تنقل مباشرة:
  goTo(id: string) {
    this.route.navigate(['/units', id]);
  }
}
