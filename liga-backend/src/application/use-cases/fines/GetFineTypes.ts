import { FineTypeRepository } from '../../../domain/repositories/FineTypeRepository';

export class GetFineTypes {
  constructor(private repo: FineTypeRepository) {}
  async execute(filters?: any) {
    return this.repo.findAll(filters);
  }
}