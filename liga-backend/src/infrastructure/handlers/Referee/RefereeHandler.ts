import { Request, Response } from 'express';
import { PrismaRefereeRepository } from '../../db/prisma/repositories/PrismaRefereeRepository';

const refereeRepo = new PrismaRefereeRepository();

export const getAllReferees = async (req: Request, res: Response) => {
  try {
    const referees = await refereeRepo.findAll();
    res.json({ success: true, data: referees });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReferee = async (req: Request, res: Response) => {
  try {
    const referee = await refereeRepo.create(req.body);
    res.status(201).json({ success: true, data: referee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReferee = async (req: Request, res: Response) => {
  try {
    const referee = await refereeRepo.update(req.params.id as string, req.body);
    res.json({ success: true, data: referee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReferee = async (req: Request, res: Response) => {
  try {
    await refereeRepo.delete(req.params.id as string);
    res.json({ success: true, message: 'Referee deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
