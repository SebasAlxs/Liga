import { Fine } from '../entities/Fine';

export interface FineRepository {
  findAll(filters?: any): Promise<Fine[]>;
  findById(id: string): Promise<Fine | null>;
  create(data: Omit<Fine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fine>;
  update(id: string, data: Partial<Fine>): Promise<Fine>;
  delete(id: string): Promise<void>;
}