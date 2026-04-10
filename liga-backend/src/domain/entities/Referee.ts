export interface Referee {
  id?: string;
  name: string;
  license?: string;
  phone?: string;
  email?: string;
  photo?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
