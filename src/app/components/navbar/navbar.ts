import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { Authintication } from '../../service/authintication';
import { ThemeService } from '../../service/theme-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // userLogedInNav: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private userAuth: Authintication,
    private themeService: ThemeService
  ) {
//   this.userAuth.userloggedmethod().subscribe((data: any) => {
//   console.log(data);
// });


    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
