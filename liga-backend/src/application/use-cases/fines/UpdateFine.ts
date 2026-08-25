import { FineRepository } from '../../../domain/repositories/FineRepository';
import { SuspensionRepository } from '../../../domain/repositories/SuspensionRepository';
import { Fine } from '../../../domain/entities/Fine';

export class UpdateFine {
  constructor(
    private fineRepository: FineRepository,
    private suspensionRepository: SuspensionRepository
  ) {}

  async execute(id: string, data: Partial<Fine>) {
    const fine = await this.fineRepository.update(id, data);

    if (data.status === 'PAID') {
      await this.suspensionRepository.serveByFineId(id);
    }

    return fine;
  }
}
