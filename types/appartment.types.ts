interface UserRole {
  id: number;
  name: string;
  description?: string;
  type?: string;
}

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

interface ApartmentOwner {
  username: string;
  email?: string;
}

interface RentRecordRenter {
  username: string;
}

interface RentRecord {
  id: number;
  start_date: string;
  end_date: string;
  renter?: RentRecordRenter;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface Apartment {
  id: number;
  title: string;
  description?: string;
  address: string;
  owner?: ApartmentOwner;
  rent_records?: RentRecord[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
