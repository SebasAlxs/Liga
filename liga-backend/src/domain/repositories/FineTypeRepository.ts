import { FineType } from '../entities/FineType';

export interface FineTypeRepository {
  findAll(filters?: any): Promise<FineType[]>;
  findById(id: string): Promise<FineType | null>;
  create(data: Omit<FineType, 'id' | 'createdAt' | 'updatedAt'>): Promise<FineType>;
  update(id: string, data: Partial<FineType>): Promise<FineType>;
  delete(id: string): Promise<void>;
}