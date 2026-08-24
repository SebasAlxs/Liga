import { FineTypeRepository } from '../../../domain/repositories/FineTypeRepository';
import { FineType } from '../../../domain/entities/FineType';

export class UpdateFineType {
  constructor(private repo: FineTypeRepository) {}
  async execute(id: string, data: Partial<FineType>) {
    return this.repo.update(id, data);
  }
}