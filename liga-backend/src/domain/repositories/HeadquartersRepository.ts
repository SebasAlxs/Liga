import { Headquarters } from "../entities/Headquarters";

export interface HeadquartersRepository {
    create(headquarters: Headquarters): Promise<Headquarters>;
    findById(id: string): Promise<Headquarters | null>;
    findAll(): Promise<Headquarters[]>;
    update(headquarters: Headquarters): Promise<Headquarters>;
    delete(id: string): Promise<void>;
}
