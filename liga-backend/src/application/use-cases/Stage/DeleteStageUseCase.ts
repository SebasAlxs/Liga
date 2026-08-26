
import { StageRepository } from "../../../domain/repositories/StageRepository";
export class DeleteStageUseCase {
    constructor(private repository: StageRepository) {}
    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
