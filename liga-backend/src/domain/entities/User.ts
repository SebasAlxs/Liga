export type UserRole = "SUPERADMIN" | "VOCAL";

export interface User {
  id?: string;
  email: string;
  password?: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
