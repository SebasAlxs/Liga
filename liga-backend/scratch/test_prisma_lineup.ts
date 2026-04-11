import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    const matchId = 'any-uuid'; // Just testing the structure
    const playerId = 'any-uuid';
    console.log('Testing findUnique with matchId_playerId...');
    const item = await prisma.matchLineup.findUnique({
      where: {
        matchId_playerId: { matchId, playerId }
      }
    });
    console.log('Result:', item);
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
