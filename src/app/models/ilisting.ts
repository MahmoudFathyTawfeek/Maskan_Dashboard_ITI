export interface Ilisting {
  id: string;
  title: string;
  hostId: string;
  descyption: string;
  pricePerNight: number;
  categoryId: number | string;
  locationType:'Seaside'|'City'|'Mountain' |'Rural';
  Location: string;
  amenitiesId:number | string;
  maxGusts:number | string;
  photos: string[];
  averageRate:number | string;
  isApproved: boolean;
}
