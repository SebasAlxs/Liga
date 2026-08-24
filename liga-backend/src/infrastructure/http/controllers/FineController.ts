import { Request, Response } from 'express';
import { PrismaFineRepository } from '../../db/prisma/repositories/PrismaFineRepository';
import { GetFines } from '../../../application/use-cases/fines/GetFines';
import { CreateFine } from '../../../application/use-cases/fines/CreateFine';
import { UpdateFine } from '../../../application/use-cases/fines/UpdateFine';
import { DeleteFine } from '../../../application/use-cases/fines/DeleteFine';

const repository = new PrismaFineRepository();

export class FineController {
  static async getAll(req: Request, res: Response) {
    try {
      const { teamId, status } = req.query;
      const useCase = new GetFines(repository);
      const fines = await useCase.execute({ teamId: teamId as string, status: status as string });
      res.json({ data: fines, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const useCase = new CreateFine(repository);
      const fine = await useCase.execute(req.body);
      res.status(201).json({ data: fine, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new UpdateFine(repository);
      const fine = await useCase.execute(id as string, req.body);
      res.json({ data: fine, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new DeleteFine(repository);
      await useCase.execute(id as string);
      res.json({ status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }
}