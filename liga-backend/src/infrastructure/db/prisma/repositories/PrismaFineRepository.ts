import { PrismaClient } from '@prisma/client';
import { FineRepository } from '../../../../domain/repositories/FineRepository';
import { Fine } from '../../../../domain/entities/Fine';

const prisma = new PrismaClient();

export class PrismaFineRepository implements FineRepository {
  async findAll(filters?: any): Promise<Fine[]> {
    const where: any = {};
    if (filters?.teamId) where.teamId = filters.teamId;
    if (filters?.status) where.status = filters.status;
    
    return prisma.fine.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' },
      include: {
        player: true,
        match: true,
        team: true
      }
    }) as unknown as Fine[];
  }

  async findById(id: string): Promise<Fine | null> {
    return prisma.fine.findUnique({ 
      where: { id },
      include: {
        player: true,
        match: true,
        team: true
      }
    }) as unknown as Fine | null;
  }

  async create(data: Omit<Fine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fine> {
    return prisma.fine.create({ 
      data,
      include: {
        player: true,
        match: true,
        team: true
      }
    }) as unknown as Fine;
  }

  async update(id: string, data: Partial<Fine>): Promise<Fine> {
    return prisma.fine.update({
      where: { id },
      data,
      include: {
        player: true,
        match: true,
        team: true
      }
    }) as unknown as Fine;
  }

  async delete(id: string): Promise<void> {
    await prisma.fine.delete({ where: { id } });
  }

  async countByPlayerReasonAndTournament(playerId: string, reason: string, tournamentId: string): Promise<number> {
    return prisma.fine.count({
      where: {
        playerId,
        reason: { equals: reason, mode: 'insensitive' },
        OR: [
          { team: { tournamentId } },
          { match: { tournamentId } }
        ]
      }
    });
  }

  async deleteByMatchEventId(matchEventId: string): Promise<void> {
    await prisma.fine.deleteMany({ where: { matchEventId } });
  }
}