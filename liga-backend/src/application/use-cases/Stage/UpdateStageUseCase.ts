
import { Stage, StageType } from "../../../domain/entities/Stage";
import { StageRepository } from "../../../domain/repositories/StageRepository";
import { NotFoundError } from "../../../domain/exceptions/NotFoundError";

export interface UpdateStageRequest {
    name?: string;
    type?: StageType;
    order?: number;
    isTwoLegged?: boolean;
}

export class UpdateStageUseCase {
    constructor(private repository: StageRepository) {}
    async execute(id: string, request: UpdateStageRequest): Promise<Stage> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Stage not found");
        if (request.name !== undefined) existing.name = request.name;
        if (request.type !== undefined) existing.type = request.type;
        if (request.order !== undefined) existing.order = request.order;
        if (request.isTwoLegged !== undefined) existing.isTwoLegged = request.isTwoLegged;
        return this.repository.update(existing);
    }
}
