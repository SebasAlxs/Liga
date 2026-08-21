export type UserRole = "SUPERADMIN" | "ADMIN" | "VOCAL" | "DIRIGENTE";

export interface User {
  id?: string;
  email: string;
  password?: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
