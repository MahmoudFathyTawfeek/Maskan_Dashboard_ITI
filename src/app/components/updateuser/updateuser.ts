import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './updateUser.html',
  styleUrls: ['./updateUser.css']
})
export class EditUserComponent implements OnInit {

  userForm!: FormGroup;
  userId!: string;

  createdAt!: string;
  updatedAt!: string;
  passwordChangedAt!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    
    this.userForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      profilePic: new FormControl(''),
      role: new FormControl(''),
      isVerified: new FormControl(false)
    });

    this.loadUser();
  }

  loadUser() {
    this.http.get<any>(`${environment.baseUrl}/users/${this.userId}`).subscribe(user => {
      this.userForm.patchValue({
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        isVerified: user.isVerified
      });

      // نخزن التواريخ للعرض فقط
      this.createdAt = user.createdAt ? user.createdAt.split('T')[0] : '';
      this.updatedAt = user.updatedAt ? user.updatedAt.split('T')[0] : '';
      this.passwordChangedAt = user.passwordChangedAt ? user.passwordChangedAt.split('T')[0] : '';
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.http.put(`${environment.baseUrl}/users/${this.userId}`, this.userForm.value)
        .subscribe(() => {
          alert('User updated successfully!');
          this.router.navigate(['/users']);
        });
    }
  }
}
