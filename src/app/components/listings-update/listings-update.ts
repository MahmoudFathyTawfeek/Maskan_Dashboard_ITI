import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Ilisting } from '../../models/ilisting';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './listings-update.html',
  styleUrls: ['./listings-update.css']
})
export class UpdateListingComponent implements OnInit {
  listingForm!: FormGroup;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));

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
      photos: new FormArray([new FormControl('')], Validators.required),
      averageRate: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
      isApproved: new FormControl(false, Validators.required)
    });

    this.loadListing();
  }

  get photos(): FormArray {
    return this.listingForm.get('photos') as FormArray;
  }

  addPhotoField() {
    this.photos.push(new FormControl(''));
  }

  removePhotoField(index: number) {
    this.photos.removeAt(index);
  }

  loadListing() {
    this.http.get<Ilisting>(`${environment.baseUrl}/listings/${this.id}`).subscribe({
      next: (listing) => {
        this.listingForm.patchValue({ ...listing, photos: [] });
        this.photos.clear();
        listing.photos.forEach((photo: string) => {
          this.photos.push(new FormControl(photo));
        });
      },
      error: (err) => {
        console.error(err);
        alert('failed to load data');
      }
    });
  }

  updateListing() {
    if (this.listingForm.valid) {
      const updated = {
        ...this.listingForm.value,
        id: this.id,
        updatedAt: new Date().toISOString()
      };

      this.http.put(`http://localhost:3000/listings/${this.id}`, updated).subscribe({
        next: () => {
          alert('Ad updated successfully');
          this.router.navigate(['/listings']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update ad');
        }
      });
    } else {
      alert('Please, try again!!');
    }
  }
}
