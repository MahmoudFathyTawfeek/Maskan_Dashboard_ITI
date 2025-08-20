import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IListing } from '../../models/ilisting';
import { RouterLink } from '@angular/router';

interface IHost { _id: string; userName: string; }
interface IAmenity { _id: string; name: string; icon?: string; }
interface ICategory { _id: string; name: string; }

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

  hosts: IHost[] = [];
  amenitiesList: IAmenity[] = [];
  categories: ICategory[] = [];
  locationTypes = ['seaside', 'city', 'mountain', 'rural'];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));

    this.listingForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      hostId: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      pricePerNight: new FormControl(0, [Validators.required, Validators.min(1)]),
      categoryId: new FormControl('', Validators.required),
      locationType: new FormControl('', Validators.required),
      governorate: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      amenitiesId: new FormArray([]),
      maxGuests: new FormControl(1, [Validators.required, Validators.min(1)]),
      photos: new FormArray([new FormControl('')], Validators.required),
      averageRating: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
      isApproved: new FormControl(false, Validators.required)
    });

    this.loadHosts();
    this.loadAmenities();
    this.loadCategories();
    this.loadListing();
  }

  get photos(): FormArray { return this.listingForm.get('photos') as FormArray; }
  get amenitiesId(): FormArray { return this.listingForm.get('amenitiesId') as FormArray; }

  addPhotoField() { this.photos.push(new FormControl('')); }
  removePhotoField(index: number) { this.photos.removeAt(index); }

  toggleAmenity(amenityId: string) {
    const index = this.amenitiesId.value.indexOf(amenityId);
    if (index >= 0) this.amenitiesId.removeAt(index);
    else this.amenitiesId.push(new FormControl(amenityId));
  }

  loadHosts() {
    this.http.get<IHost[]>(`${environment.baseUrl}/users?role=host`)
      .subscribe(data => this.hosts = data);
  }

  loadAmenities() {
    this.http.get<IAmenity[]>(`${environment.baseUrl}/amenities`)
      .subscribe(data => this.amenitiesList = data);
  }

  loadCategories() {
    this.http.get<ICategory[]>(`${environment.baseUrl}/categories`)
      .subscribe(data => this.categories = data);
  }

  loadListing() {
    this.http.get<IListing>(`${environment.baseUrl}/listings/${this.id}`).subscribe({
      next: (listing) => {
        this.listingForm.patchValue({
          title: listing.title,
          hostId: listing.host?._id || listing.host,
          description: listing.descrption,
          pricePerNight: listing.pricePerNight,
          categoryId: listing.categoryId?._id || listing.categoryId,
          locationType: listing.locationType,
          governorate: listing.governorate,
          location: listing.location?.address || '',
          maxGuests: listing.maxGustes,
          averageRating: listing.averageRating || 0,
          isApproved: listing.isApproved
        });

        // Photos
        this.photos.clear();
        listing.photos.forEach(p => this.photos.push(new FormControl(p)));

        // Amenities
        this.amenitiesId.clear();
        listing.amenitiesId.forEach(a => this.amenitiesId.push(new FormControl(a._id || a)));
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load data');
      }
    });
  }

  updateListing() {
    if (this.listingForm.valid) {
      const updated = { ...this.listingForm.value, id: this.id, updatedAt: new Date().toISOString() };
      this.http.put(`${environment.baseUrl}/listings/${this.id}`, updated).subscribe({
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
      alert('Please, fill all required fields!');
    }
  }
}
