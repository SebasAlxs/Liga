import { HeadquartersRepository } from "../../../domain/repositories/HeadquartersRepository";

export class DeleteHeadquartersUseCase {
    constructor(private hqRepository: HeadquartersRepository) { }

    async execute(id: string): Promise<void> {
        const existing = await this.hqRepository.findById(id);
        if (!existing) {
            throw new Error("Sede no encontrada");
        }
        await this.hqRepository.delete(id);
    }
}
