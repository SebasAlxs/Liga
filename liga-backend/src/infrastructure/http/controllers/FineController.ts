import { Request, Response } from 'express';
import { PrismaFineRepository } from '../../db/prisma/repositories/PrismaFineRepository';
import { PrismaSuspensionRepository } from '../../db/prisma/repositories/PrismaSuspensionRepository';
import { PrismaTeamRepository } from '../../db/prisma/repositories/PrismaTeamRepository';
import { PrismaMatchRepository } from '../../db/prisma/repositories/PrismaMatchRepository';
import { PrismaTournamentRepository } from '../../db/prisma/repositories/PrismaTournamentRepository';
import { GetFines } from '../../../application/use-cases/fines/GetFines';
import { CreateFine } from '../../../application/use-cases/fines/CreateFine';
import { UpdateFine } from '../../../application/use-cases/fines/UpdateFine';
import { DeleteFine } from '../../../application/use-cases/fines/DeleteFine';

const repository = new PrismaFineRepository();
const suspensionRepository = new PrismaSuspensionRepository();
const teamRepository = new PrismaTeamRepository();
const matchRepository = new PrismaMatchRepository();
const tournamentRepository = new PrismaTournamentRepository();

export class FineController {
  static async getAll(req: Request, res: Response) {
    try {
      const { teamId, status, playerId } = req.query;
      const useCase = new GetFines(repository);
      const fines = await useCase.execute({ teamId: teamId as string, status: status as string, playerId: playerId as string });
      res.json({ data: fines, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const useCase = new CreateFine(repository, suspensionRepository, teamRepository, matchRepository, tournamentRepository);
      const fine = await useCase.execute(req.body);
      res.status(201).json({ data: fine, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new UpdateFine(repository, suspensionRepository);
      const fine = await useCase.execute(id as string, req.body);
      res.json({ data: fine, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new DeleteFine(repository, suspensionRepository);
      await useCase.execute(id as string);
      res.json({ status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }
}