import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Verifying data ---');
  const counts = {
    headquarters: await prisma.headquarters.count(),
    tournaments: await prisma.tournament.count(),
    categories: await prisma.category.count(),
    teams: await prisma.team.count(),
    players: await prisma.player.count(),
  };
  console.log('Counts:', counts);
  await prisma.$disconnect();
}
main();
