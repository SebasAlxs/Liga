import { FineRepository } from '../../../domain/repositories/FineRepository';

export class DeleteFine {
  constructor(private repo: FineRepository) {}
  async execute(id: string) {
    return this.repo.delete(id);
  }
}
