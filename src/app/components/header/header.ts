import { ThemeService } from './../../service/theme-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
    isDarkMode: boolean = false;

  constructor(private themeService:ThemeService){
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
