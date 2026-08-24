import { FineRepository } from '../../../domain/repositories/FineRepository';
import { SuspensionRepository } from '../../../domain/repositories/SuspensionRepository';

export class DeleteFine {
  constructor(
    private fineRepository: FineRepository,
    private suspensionRepository: SuspensionRepository
  ) {}

  async execute(id: string) {
    await this.fineRepository.delete(id);
    await this.suspensionRepository.deleteByFineId(id);
  }
}
