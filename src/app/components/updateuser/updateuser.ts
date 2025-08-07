import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Iuser } from '../../models/iuser';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './updateuser.html',
  styleUrls: ['./updateuser.css']
})
export class EditUserComponent implements OnInit {
  userForm!: FormGroup;
  userId!: string;
  showPassword: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ?? '';

    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''), // يمكن جعله Required حسب الحاجة
      phone: new FormControl('', Validators.required),
      gender: new FormControl(''),
      dateOfBirth: new FormControl(''),
      isVerified: new FormControl(false),
      isAdmin: new FormControl(false)
    });

    this.loadUser();
  }

  loadUser() {
    this.http.get<Iuser>(`${environment.baseUrl}/users/${this.userId}`).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load user data');
      }
    });
  }

  updateUser() {
    if (this.userForm.valid) {
      this.http.put(`${environment.baseUrl}/users/${this.userId}`, this.userForm.value).subscribe({
        next: () => {
          alert('User data updated successfully');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Failed to update user', error);
          alert('Update failed. Try again.');
        }
      });
    }
  }
}
