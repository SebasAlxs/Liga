import { Request, Response } from "express";
import { GetVocaliaSheetDataUseCase } from "../../../../../application/use-cases/Match/GetVocaliaSheetDataUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { renderVocaliaSheetHtml } from "../../../../services/pdf/vocaliaSheetTemplate";
import { PdfGeneratorService } from "../../../../services/pdf/PdfGeneratorService";
import { handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const useCase = new GetVocaliaSheetDataUseCase(
            new PrismaMatchRepository(),
            new PrismaMatchLineupRepository(),
            new PrismaMatchEventRepository(),
            new PrismaPlayerRepository(),
            new PrismaTeamRepository(),
            new PrismaTournamentRepository(),
            new PrismaCategoryRepository()
        );

        const sheetData = await useCase.execute(req.params.id as string);
        const html = renderVocaliaSheetHtml(sheetData);
        const pdf = await new PdfGeneratorService().generateFromHtml(html);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="hoja-vocalia-${sheetData.matchId}.pdf"`);
        return res.status(200).send(pdf);
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
