import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { Home } from './components/home/home';
import { Notfound } from './components/notfound/notfound';
import { Login } from './components/login/login';
import { AddUnitComponent } from './components/add-product/add-product';
import { UnitsComponent } from './components/product-cards/product-cards';
import { UsersComponent } from './components/users/users';
import { AddUserComponent } from './components/adduser/adduser';
import { EditUserComponent } from './components/updateuser/updateuser';
import { UnitDetailsComponent } from './components/details/details';
import { ListingsComponent } from './components/listings/listings';
import { AddListingComponent } from './components/listings-form/listings-form';
import { UpdateListingComponent } from './components/listings-update/listings-update';
import { BookingsComponent } from './components/bookings/bookings';
import { AdminListingsComponent } from './components/admin-listings/admin-listings';






export const routes: Routes = [{

  
    path: '',
    component: Main,
    children: [

      { path: '', redirectTo: '/login', pathMatch: 'full' },
     { path: 'home', component: Home, title: 'Home_page' },
      { path: 'users', component: UsersComponent, title: 'users'},
      { path: 'users/add', component: AddUserComponent, title: 'add-users'},
      { path: 'users/update/:id', component: EditUserComponent, title: 'edit-users'},
      { path: 'Add-unit', component: AddUnitComponent, title: 'add-unit'},
      { path: 'units', component: UnitsComponent,title:'units', },
      {path: 'units/:id',component: UnitDetailsComponent,title:'unit details'},
      { path: 'listings', component: ListingsComponent, title:'Listings' },
      { path: 'listings/add', component: AddListingComponent, title:'Add Listing'  },
      {path: 'listings/update/:id',component: UpdateListingComponent,title :'Update Listing'},
       { path: 'bookings', component: BookingsComponent, title:'Bookings' },
       {path: 'newlistings',component:AdminListingsComponent, title: 'Admin Listings',}

    
    ]
  },
  
  { path: 'login', component: Login, title: 'login'},
  { path: '**', component: Notfound, title: 'Not_Found' },
];



































 
