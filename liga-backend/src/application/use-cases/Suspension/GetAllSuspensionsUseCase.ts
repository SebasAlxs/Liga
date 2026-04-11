import { Suspension } from "../../../domain/entities/Suspension";
import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";

export class GetAllSuspensionsUseCase {
    constructor(private suspensionRepository: SuspensionRepository) {}

    async execute(): Promise<Suspension[]> {
        return await (this.suspensionRepository as any).findAll();
    }
}
