import { Request, Response } from "express";
import { GetFixturePdfDataUseCase } from "../../../../../application/use-cases/Match/GetFixturePdfDataUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { renderFixtureHtml } from "../../../../services/pdf/fixtureTemplate";
import { PdfGeneratorService } from "../../../../services/pdf/PdfGeneratorService";
import { handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const tournamentId = req.query.tournamentId as string;
        const categoryId = req.query.categoryId as string;
        const stageId = req.query.stageId as string | undefined;

        const useCase = new GetFixturePdfDataUseCase(
            new PrismaMatchRepository(),
            new PrismaTeamRepository(),
            new PrismaTournamentRepository(),
            new PrismaCategoryRepository()
        );

        const fixtureData = await useCase.execute(tournamentId, categoryId, stageId);
        const html = renderFixtureHtml(fixtureData);
        const pdf = await new PdfGeneratorService().generateFromHtml(html);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="fixture-${tournamentId}-${categoryId}.pdf"`);
        return res.status(200).send(pdf);
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
