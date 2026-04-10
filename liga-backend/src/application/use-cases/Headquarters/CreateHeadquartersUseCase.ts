import crypto from "crypto";
import { CreateHeadquartersRequest, HeadquartersResponse } from "../../../adapters/http/dto/HeadquartersResponse";
import { Headquarters } from "../../../domain/entities/Headquarters";
import { HeadquartersRepository } from "../../../domain/repositories/HeadquartersRepository";

export class CreateHeadquartersUseCase {
    constructor(private hqRepository: HeadquartersRepository) { }

    async execute(request: CreateHeadquartersRequest): Promise<HeadquartersResponse> {
        const hq = new Headquarters(
            crypto.randomUUID(),
            request.name,
            request.city,
            request.address,
            request.active !== undefined ? request.active : true
        );

        const created = await this.hqRepository.create(hq);

        return {
            id: created.id,
            name: created.name,
            city: created.city,
            address: created.address,
            active: created.active,
        };
    }
}
