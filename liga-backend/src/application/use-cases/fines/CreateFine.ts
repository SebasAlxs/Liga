import { FineRepository } from '../../../domain/repositories/FineRepository';
import { Fine } from '../../../domain/entities/Fine';

export class CreateFine {
  constructor(private fineRepository: FineRepository) {}
  async execute(data: Omit<Fine, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fineRepository.create(data);
  }
}