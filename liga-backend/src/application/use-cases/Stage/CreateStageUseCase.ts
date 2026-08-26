
import { Stage, StageType } from "../../../domain/entities/Stage";
import { StageRepository } from "../../../domain/repositories/StageRepository";
import crypto from "crypto";

export interface CreateStageRequest {
    tournamentId: string;
    name: string;
    type: StageType;
    order: number;
    isTwoLegged?: boolean;
}

export class CreateStageUseCase {
    constructor(private repository: StageRepository) {}
    async execute(request: CreateStageRequest): Promise<Stage> {
        const stage = new Stage(crypto.randomUUID(), request.tournamentId, request.name, request.type, request.order, request.isTwoLegged ?? false);
        return this.repository.create(stage);
    }
}
