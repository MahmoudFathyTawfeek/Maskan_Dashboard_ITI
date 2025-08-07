import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsForm } from './listings-form';

describe('ListingsForm', () => {
  let component: ListingsForm;
  let fixture: ComponentFixture<ListingsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
