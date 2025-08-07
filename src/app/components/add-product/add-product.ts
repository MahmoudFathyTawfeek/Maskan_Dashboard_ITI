import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddUnitService } from '../../service/add-product-service';
import { Iunit } from '../../models/iunit';

@Component({
  selector: 'app-add-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddUnitComponent {

  unitService = inject(AddUnitService);
  unitForm: FormGroup;
  unitData: Iunit = {} as Iunit;

  constructor() {
    this.unitForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      location: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(1)]),
      imageUrl: new FormControl('', Validators.required),
      isAvailable: new FormControl(true)
    });
  }

addUnit() {
  if (this.unitForm.valid) {
    const { id, ...unitWithoutId } = this.unitForm.value;

    this.unitService.addUnit(unitWithoutId).subscribe(data => {
      console.log(data);
      alert("Uint added successfully");
    });
  } else {
    alert("Please, enter correct inputs");
  }
}

}

