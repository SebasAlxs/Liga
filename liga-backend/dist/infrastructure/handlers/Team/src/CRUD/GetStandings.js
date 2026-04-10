"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetStandingsUseCase_1 = require("../../../../../application/use-cases/Stats/GetStandingsUseCase");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const useCase = new GetStandingsUseCase_1.GetStandingsUseCase(repo);
        const tournamentId = req.params.tournamentId;
        if (!tournamentId) {
            throw new Error("El ID del torneo es requerido");
        }
        const standings = await useCase.execute(tournamentId);
        return (0, api_gateway_1.successResponse)(res, standings, 200, "Tabla de posiciones obtenida exitosamente.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
