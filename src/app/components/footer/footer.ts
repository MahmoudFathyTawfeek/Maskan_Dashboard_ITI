import { Component } from '@angular/core';
import { ThemeService } from '../../service/theme-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
