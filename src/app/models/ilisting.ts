import { Iuser } from "./iuser";
import { ICategory } from "./icategory";
import { IAmenity } from "./iamenity";
import { ILocation } from "./ilocation";

export interface IListing {
  _id?: string;
  host: Iuser;   // ممكن يرجع populated (Iuser) أو مجرد id
  title: string;
  descrption: string;
  roomNumbers?: number;
  pricePerNight: number;

  categoryId: ICategory;  // populated أو id
  locationType: 'seaside' | 'city' | 'mountain' | 'rural';
  location: ILocation;

  governorate:
    | 'Cairo'
    | 'Giza'
    | 'Alexandria'
    | 'Qalyubia'
    | 'PortSaid'
    | 'Suez'
    | 'Dakahlia'
    | 'Sharqia'
    | 'Gharbia'
    | 'Monufia'
    | 'Beheira'
    | 'KafrElSheikh'
    | 'Fayoum'
    | 'BeniSuef'
    | 'Minya'
    | 'Assiut'
    | 'Sohag'
    | 'Qena'
    | 'Luxor'
    | 'Aswan'
    | 'RedSea'
    | 'NewValley'
    | 'Matrouh'
    | 'NorthSinai'
    | 'SouthSinai';

  amenitiesId: IAmenity[];

  maxGustes: number;
  photos: string[];

  bookedDates?: {
    date: string;
    bookingId?: string | undefined;
    guestId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    dayType?: 'check-in' | 'stay' | 'check-out';
  }[];

  reviews?: {
    user: Iuser;
    rating: number;
    comment?: string;
    createdAt?: string;
  }[];

  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;

  averageRating?: number; // Virtual field
  arTitle?: string;
  arDescrption?: string;
  bathrooms?: number;
}
