import { UserResponse } from "../../../adapters/http/dto/UserResponse";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(): Promise<UserResponse[]> {
        const users = await this.userRepository.findAll();
        return users.map((u) => ({
            _id: u.id!,
            email: u.email,
            role: u.role!,
            createdAt: u.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: u.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
