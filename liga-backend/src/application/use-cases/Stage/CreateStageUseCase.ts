
import { Stage, StageType } from "../../../domain/entities/Stage";
import { StageRepository } from "../../../domain/repositories/StageRepository";
import crypto from "crypto";

export interface CreateStageRequest {
    tournamentId: string;
    name: string;
    type: StageType;
    order?: number;
    isTwoLegged?: boolean;
}

export class CreateStageUseCase {
    constructor(private repository: StageRepository) {}
    async execute(request: CreateStageRequest): Promise<Stage> {
        let order = request.order;
        if (order === undefined) {
            const existingStages = await this.repository.findByTournament(request.tournamentId);
            order = existingStages.length > 0 ? Math.max(...existingStages.map(s => s.order)) + 1 : 1;
        }
        
        const stage = new Stage(crypto.randomUUID(), request.tournamentId, request.name, request.type, order, request.isTwoLegged ?? false);
        return this.repository.create(stage);
    }
}
