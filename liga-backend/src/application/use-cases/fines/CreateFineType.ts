import { FineTypeRepository } from '../../../domain/repositories/FineTypeRepository';
import { FineType } from '../../../domain/entities/FineType';

export class CreateFineType {
  constructor(private repo: FineTypeRepository) {}
  async execute(data: Omit<FineType, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.repo.create(data);
  }
}