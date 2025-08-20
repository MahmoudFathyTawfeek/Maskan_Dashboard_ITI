export interface ILocation {
  address: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number];
  }
}