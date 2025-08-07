import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsUpdate } from './listings-update';

describe('ListingsUpdate', () => {
  let component: ListingsUpdate;
  let fixture: ComponentFixture<ListingsUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingsUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
