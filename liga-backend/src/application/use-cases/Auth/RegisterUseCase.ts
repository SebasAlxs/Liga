import bcrypt from "bcryptjs";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { User } from "../../../domain/entities/User";

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: User): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("El correo electrónico ya está en uso.");
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.create(userToCreate);

    // Remove password before returning
    const { password, ...userWithoutPassword } = createdUser as any;
    return userWithoutPassword;
  }
}
