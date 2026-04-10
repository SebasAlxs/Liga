"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTeamUseCase = void 0;
class DeleteTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(id) {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            throw new Error("Team not found");
        }
        await this.teamRepository.delete(id);
    }
}
exports.DeleteTeamUseCase = DeleteTeamUseCase;
