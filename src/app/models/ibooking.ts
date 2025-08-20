export interface Ibooking {
  id: number;
  userId: string;
  listingId: string;
  checkIn:Date;
  checkOut: Date;
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: 'stripo' | 'paypal' ;
  createdAt: Date;

}


