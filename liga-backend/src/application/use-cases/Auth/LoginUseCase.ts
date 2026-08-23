import { DomainError } from "../../../domain/exceptions/DomainError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { User } from "../../../domain/entities/User";

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user || !user.password) {
      throw new DomainError("Credenciales inválidas.");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new DomainError("Credenciales inválidas.");
    }

    const secret = process.env.JWT_SECRET || "supersecretkey"; // Ideally this is in .env
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" },
    );

    const { password, ...userWithoutPassword } = user as any;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
