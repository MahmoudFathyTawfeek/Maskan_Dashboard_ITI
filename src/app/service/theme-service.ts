import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.initTheme(); // استرجاع الثيم عند بداية الخدمة
  }

  toggleTheme(): void {
    const current = this.darkModeSubject.value;
    this.setTheme(!current);
  }

  setTheme(isDark: boolean): void {
    this.darkModeSubject.next(isDark);

    const body = document.body;
    if (isDark) {
      body.classList.add('bg-black', 'text-light');
      body.classList.remove('bg-light', 'text-dark');
    } else {
      body.classList.add('bg-light', 'text-dark');
      body.classList.remove('bg-black', 'text-light');
    }

    // حفظ الثيم
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }

  initTheme(): void {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved ? JSON.parse(saved) : false;
    this.setTheme(isDark);
  }
}
