import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Ilisting } from '../../models/ilisting';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './listings-form.html',
  styleUrls: ['./listings-form.css']
})
export class AddListingComponent {
  listingForm: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.listingForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      hostId: new FormControl('', [Validators.required]),
      descyption: new FormControl('', [Validators.required, Validators.minLength(10)]),
      pricePerNight: new FormControl(0, [Validators.required, Validators.min(1)]),
      categoryId: new FormControl('', Validators.required),
      locationType: new FormControl('City', Validators.required),
      Location: new FormControl('', Validators.required),
      amenitiesId: new FormControl('', Validators.required),
      maxGusts: new FormControl(1, [Validators.required, Validators.min(1)]),
      photos: new FormArray([
        new FormControl('', Validators.required)
      ]),
      averageRate: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
      isApproved: new FormControl(false, Validators.required)
    });
  }

  get photos(): FormArray {
    return this.listingForm.get('photos') as FormArray;
  }

  addPhotoField() {
    this.photos.push(new FormControl('', Validators.required));
  }

  removePhotoField(index: number) {
    if (this.photos.length > 1) {
      this.photos.removeAt(index);
    }
  }

  addListing() {
    if (this.listingForm.valid) {
      const listingData = {
        ...this.listingForm.value,
        photos: this.photos.value  // تأكيد أن الصور مصفوفة فعلاً
      };

      this.http.post<Ilisting>(`${environment.baseUrl}/listings`, listingData).subscribe(() => {
        alert('New listing added successfully');
        this.router.navigate(['/listings']);
      });
    } else {
      alert('Please, enter correct inputs');
    }
  }
}
