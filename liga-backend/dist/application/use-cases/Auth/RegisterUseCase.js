"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("El correo electrónico ya está en uso.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const userToCreate = {
            ...userData,
            password: hashedPassword,
        };
        const createdUser = await this.userRepository.create(userToCreate);
        // Remove password before returning
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }
}
exports.RegisterUseCase = RegisterUseCase;
