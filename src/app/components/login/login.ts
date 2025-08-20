import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Authintication } from '../../service/authintication';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule]
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Authintication
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;

      this.authService.getUsers().subscribe({
        next: (users) => {
          this.loading = false;

          const user = users.find(u => u.email === email && u.password === password);

          if (!user) {
            alert('Invalid email or password');
            return;
          }

          if (user.role === 'admin') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/home']);
          } else {
            alert('Access denied: Admins only');
          }
        },
        error: () => {
          this.loading = false;
          alert('Something went wrong. Please try again.');
        }
      });
    }
  }
}
