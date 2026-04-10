"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CheckInPlayerUseCase_1 = require("../../../../../application/use-cases/MatchLineup/CheckInPlayerUseCase");
const UpdateLineupStatusUseCase_1 = require("../../../../../application/use-cases/MatchLineup/UpdateLineupStatusUseCase");
const PrismaMatchLineupRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchLineupRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("ID is required");
        }
        const repo = new PrismaMatchLineupRepository_1.PrismaMatchLineupRepository();
        const { checkedIn, status } = req.body;
        let result;
        if (checkedIn !== undefined) {
            const useCase = new CheckInPlayerUseCase_1.CheckInPlayerUseCase(repo);
            result = await useCase.execute(id, checkedIn);
        }
        else if (status !== undefined) {
            const useCase = new UpdateLineupStatusUseCase_1.UpdateLineupStatusUseCase(repo);
            result = await useCase.execute(id, status);
        }
        else {
            throw new Error("No update data provided (checkedIn or status)");
        }
        return (0, api_gateway_1.successResponse)(res, result, 200, "Nómina actualizada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
