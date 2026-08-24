import { FineTypeRepository } from '../../../domain/repositories/FineTypeRepository';

export class DeleteFineType {
  constructor(private repo: FineTypeRepository) {}
  async execute(id: string) {
    return this.repo.delete(id);
  }
}