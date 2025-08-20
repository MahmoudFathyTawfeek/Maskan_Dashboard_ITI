export interface Iuser {
  _id?: string;
  userName: string;
  email: string;
  profilePic?: string;
  role: 'host' | 'guest' | 'admin';
  isVerified: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  passwordChangedAt?: string; // ISO date string
}
