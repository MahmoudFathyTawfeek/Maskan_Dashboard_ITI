import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Iuser } from '../../models/iuser';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './adduser.html',
  styleUrls: ['./adduser.css']
})
export class AddUserComponent {
  userForm: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.userForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      profilePic: new FormControl(''),
      role: new FormControl('guest', Validators.required),
      isVerified: new FormControl(false),
      createdAt: new FormControl(new Date().toISOString().split('T')[0]),
      updatedAt: new FormControl(new Date().toISOString().split('T')[0]),
      passwordChangedAt: new FormControl('') 
    });
  }

  addUser() {
    if (this.userForm.valid) {
      // تحويل التواريخ إلى ISO قبل الإرسال
      const payload = {
        ...this.userForm.value,
        createdAt: new Date(this.userForm.value.createdAt).toISOString(),
        updatedAt: new Date(this.userForm.value.updatedAt).toISOString(),
        passwordChangedAt: this.userForm.value.passwordChangedAt 
          ? new Date(this.userForm.value.passwordChangedAt).toISOString()
          : undefined
      };

      this.http.post<Iuser>(`${environment.baseUrl}/users`, payload).subscribe({
        next: () => {
          alert('User added successfully');
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Add user failed:', err);
          alert('Failed to add user. Check console.');
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      alert('Please, fill all required fields correctly.');
    }
  }
}
