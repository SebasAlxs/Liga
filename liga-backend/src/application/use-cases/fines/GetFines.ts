import { FineRepository } from '../../../domain/repositories/FineRepository';

export class GetFines {
  constructor(private fineRepository: FineRepository) {}
  async execute(filters?: any) {
    return this.fineRepository.findAll(filters);
  }
}