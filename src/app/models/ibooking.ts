export interface Ibooking {
  id: number;
  userId: string;
  listingId: string;
  checkInDate:Date;
  checkOutDate: Date;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'stripo' | 'paypal' ;
  createdAt: Date;

}


