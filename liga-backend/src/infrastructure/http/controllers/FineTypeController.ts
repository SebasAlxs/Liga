import { Request, Response } from 'express';
import { PrismaFineTypeRepository } from '../../db/prisma/repositories/PrismaFineTypeRepository';
import { GetFineTypes } from '../../../application/use-cases/fines/GetFineTypes';
import { CreateFineType } from '../../../application/use-cases/fines/CreateFineType';
import { UpdateFineType } from '../../../application/use-cases/fines/UpdateFineType';
import { DeleteFineType } from '../../../application/use-cases/fines/DeleteFineType';

const repository = new PrismaFineTypeRepository();

export class FineTypeController {
  static async getAll(req: Request, res: Response) {
    try {
      const { active } = req.query;
      const filters: any = {};
      if (active !== undefined) filters.active = active === 'true';
      const useCase = new GetFineTypes(repository);
      const types = await useCase.execute(filters);
      res.json({ data: types, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const useCase = new CreateFineType(repository);
      const type = await useCase.execute(req.body);
      res.status(201).json({ data: type, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new UpdateFineType(repository);
      const type = await useCase.execute(id as string, req.body);
      res.json({ data: type, status: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new DeleteFineType(repository);
      await useCase.execute(id as string);
      res.json({ data: null, status: true, message: 'Deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message, status: false });
    }
  }
}