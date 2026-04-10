import { HeadquartersResponse } from "../../../adapters/http/dto/HeadquartersResponse";
import { HeadquartersRepository } from "../../../domain/repositories/HeadquartersRepository";

export class GetHeadquartersUseCase {
    constructor(private hqRepository: HeadquartersRepository) { }

    async execute(): Promise<HeadquartersResponse[]> {
        const hqs = await this.hqRepository.findAll();
        return hqs.map((hq) => ({
            id: hq.id,
            name: hq.name,
            city: hq.city,
            address: hq.address,
            active: hq.active,
        }));
    }
}
