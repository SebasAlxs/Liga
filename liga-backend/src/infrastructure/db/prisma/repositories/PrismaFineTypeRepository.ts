import { PrismaClient } from '@prisma/client';
import { FineTypeRepository } from '../../../../domain/repositories/FineTypeRepository';
import { FineType } from '../../../../domain/entities/FineType';

const prisma = new PrismaClient();

export class PrismaFineTypeRepository implements FineTypeRepository {
  async findAll(filters?: any): Promise<FineType[]> {
    const where: any = {};
    if (filters?.active !== undefined) where.active = filters.active;
    
    return prisma.fineType.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' }
    }) as unknown as FineType[];
  }

  async findById(id: string): Promise<FineType | null> {
    return prisma.fineType.findUnique({ where: { id } }) as unknown as FineType | null;
  }

  async create(data: Omit<FineType, 'id' | 'createdAt' | 'updatedAt'>): Promise<FineType> {
    return prisma.fineType.create({ data }) as unknown as FineType;
  }

  async update(id: string, data: Partial<FineType>): Promise<FineType> {
    return prisma.fineType.update({
      where: { id },
      data,
    }) as unknown as FineType;
  }

  async delete(id: string): Promise<void> {
    await prisma.fineType.delete({ where: { id } });
  }
}