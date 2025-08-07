export interface Iuser {
  id?: number | string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  gender: 'male' | 'female';
  dateOfBirth: Date; 
  isAdmin?: boolean;
  isVerified: boolean;
}
