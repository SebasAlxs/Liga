import { FineRepository } from '../../../domain/repositories/FineRepository';
import { Fine } from '../../../domain/entities/Fine';

export class UpdateFine {
  constructor(private fineRepository: FineRepository) {}
  async execute(id: string, data: Partial<Fine>) {
    return this.fineRepository.update(id, data);
  }
}