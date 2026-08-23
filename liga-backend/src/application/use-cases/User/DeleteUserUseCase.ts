import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { DomainError } from "../../../domain/exceptions/DomainError";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(id: string, requesterId?: string): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError("Usuario no encontrado.");
        }

        if (requesterId && requesterId === id) {
            throw new DomainError("No puedes eliminar tu propia cuenta.");
        }

        if (existingUser.role === "SUPERADMIN") {
            const allUsers = await this.userRepository.findAll();
            const superAdminCount = allUsers.filter((u) => u.role === "SUPERADMIN").length;
            if (superAdminCount <= 1) {
                throw new DomainError("No se puede eliminar al único administrador principal.");
            }
        }

        await this.userRepository.delete(id);
    }
}
