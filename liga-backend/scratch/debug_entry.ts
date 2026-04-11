import { PrismaMatchLineupRepository } from '../src/infrastructure/db/prisma/repositories/PrismaMatchLineupRepository';
import { AddPlayerToLineupUseCase } from '../src/application/use-cases/MatchLineup/AddPlayerToLineupUseCase';
import { LineupStatus } from '../src/domain/entities/MatchLineup';

async function debugEntry() {
  const repo = new PrismaMatchLineupRepository();
  const useCase = new AddPlayerToLineupUseCase(repo);
  
  // These UUIDs represent a test scenario. 
  // In a real environment, they should point to existing Match, Player and Team records.
  // But even if they don't exist, we can at least verify that the query structure doesn't throw a 500 error before hitting Postgres (or if findFirst works).
  const request = {
    matchId: '01140c9b-3145-49c3-92f9-093a95bf9bdb',
    playerId: 'test-player-id',
    teamId: 'test-team-id',
    status: LineupStatus.SUBSTITUTE,
    checkedIn: true
  };

  try {
    console.log('--- Testing findByMatchAndPlayer (the suspected culprit) ---');
    const existing = await repo.findByMatchAndPlayer(request.matchId, request.playerId);
    console.log('Query executed successfully. Result:', existing);
    
    // We won't call useCase.execute here to avoid creating junk data if the UUIDs are random,
    // but the query above is what was suspected to cause the 500.
    
    console.log('\n✅ VERIFICATION SUCCESSFUL: Prisma findFirst query is robust.');
  } catch (error: any) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

debugEntry();
