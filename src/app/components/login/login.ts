import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Authintication } from '../../service/authintication';
import {jwtDecode} from 'jwt-decode'
import Swal from 'sweetalert2'
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, Footer, Header]
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Authintication,
    private cookieService: CookieService
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

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;

        if (response?.token) {
          // Store the token in localStorage
          this.cookieService.set('token', response.token, { path: '/', sameSite: 'Lax' });
          localStorage.setItem('token', response.token);
          try {
            const decoded: any = jwtDecode(response.token);

            if (decoded.role === 'admin') {

              Swal.fire({
                icon: "success",
                title: "Successful",
                text: `${response?.message?.en || "Login successful!"}`,
                timer: 2000,
                showConfirmButton: false
              });
              this.router.navigate(['/home']);
            } else {
              Swal.fire({
                icon: "error",
                title: "No permissions",
                text: "You don’t have permission to access the dashboard.",
              });
            }
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Token error",
              text: "Invalid or corrupted token received.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid login",
            text: `${response?.message?.en}`,
          });
        }
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: err?.error?.message?.en || "Invalid email or password",
        });
      }
    });
  }
}
}
