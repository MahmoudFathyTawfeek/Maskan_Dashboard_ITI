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
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.pattern('^[0-9]{10,15}$')]),

    gender: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    isVerified: new FormControl(false),
    isAdmin: new FormControl(false),
  });
}



  addUser() {
    if (this.userForm.valid) {
      this.http.post<Iuser>(`${environment.baseUrl}/users`, this.userForm.value).subscribe(() => {
        alert('User added successfully');
        this.router.navigate(['/users']);
      });  
    } else {
      alert('Please, enter a valid inputs');
    }
  }



}
