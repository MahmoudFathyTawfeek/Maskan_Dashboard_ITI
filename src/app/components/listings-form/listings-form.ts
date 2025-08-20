import { Component, OnInit } from '@angular/core';
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
import { IListing } from '../../models/ilisting';

interface IHost { _id: string; userName: string; }
interface IAmenity { _id: string; name: string; icon?: string; }
interface ICategory { _id: string; name: string; }

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './listings-form.html',
  styleUrls: ['./listings-form.css']
})
export class AddListingComponent implements OnInit {
  listingForm!: FormGroup;
  hosts: IHost[] = [];
  amenitiesList: IAmenity[] = [];
  categories: ICategory[] = [];
  locationTypes = ['Seaside', 'City', 'Mountain', 'Rural'];
  governorates = [
    'Cairo','Giza','Alexandria','Qalyubia','PortSaid','Suez','Dakahlia','Sharqia','Gharbia',
    'Monufia','Beheira','KafrElSheikh','Fayoum','BeniSuef','Minya','Assiut','Sohag','Qena',
    'Luxor','Aswan','RedSea','NewValley','Matrouh','NorthSinai','SouthSinai'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
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
      photos: new FormArray([new FormControl('', Validators.required)]),
      averageRating: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
      isApproved: new FormControl(false, Validators.required)
    });

    this.loadHosts();
    this.loadAmenities();
    this.loadCategories();
  }

  get photos(): FormArray {
    return this.listingForm.get('photos') as FormArray;
  }

  get amenitiesId(): FormArray {
    return this.listingForm.get('amenitiesId') as FormArray;
  }

  addPhotoField() { this.photos.push(new FormControl('', Validators.required)); }
  removePhotoField(index: number) { if (this.photos.length > 1) this.photos.removeAt(index); }

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

  addListing() {
    if (this.listingForm.valid) {
      const listingData = {
        ...this.listingForm.value,
        photos: this.photos.value
      };
      this.http.post<IListing>(`${environment.baseUrl}/listings`, listingData)
        .subscribe(() => {
          alert('New listing added successfully');
          this.router.navigate(['/listings']);
        }, err => {
          console.error(err);
          alert('Failed to add listing');
        });
    } else {
      alert('Please, fill all required fields!');
    }
  }
}
