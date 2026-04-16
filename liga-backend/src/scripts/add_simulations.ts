import { PrismaClient, MatchStatus } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const matchesToCreate = [
  // Confirmados por el usuario ("Última fecha")
  { home: 'Inter', away: 'San jose', homeScore: 7, awayScore: 4 },
  { home: 'Barcelona', away: 'Estrella', homeScore: 2, awayScore: 6 },
  { home: 'Danubio', away: 'Milan', homeScore: 6, awayScore: 4 },
  
  // Simulaciones para cuadrar la tabla
  { home: 'Estrella', away: 'San jose', homeScore: 8, awayScore: 2 },
  { home: 'Estrella', away: 'Real madrid', homeScore: 5, awayScore: 2 },
  { home: 'Estrella', away: 'Milan', homeScore: 3, awayScore: 0},
  { home: 'Inter', away: 'Barcelona', homeScore: 2, awayScore: 2 },
  { home: 'Inter', away: 'Danubio', homeScore: 3, awayScore: 2 },
  { home: 'Barcelona', away: 'San jose', homeScore: 4, awayScore: 4 },
  { home: 'Barcelona', away: 'Milan', homeScore: 7, awayScore: 3 },
  { home: 'Real madrid', away: 'Danubio', homeScore: 5, awayScore: 1 },
  { home: 'Real madrid', away: 'San jose', homeScore: 0, awayScore: 0 }
];

const teamStats = [
  { name: 'Estrella', pj: 4, g: 4, e: 0, p: 0, gf: 19, gc: 6, pts: 12 },
  { name: 'Inter', pj: 3, g: 2, e: 1, p: 0, gf: 12, gc: 8, pts: 7 },
  { name: 'Barcelona', pj: 4, g: 1, e: 2, p: 1, gf: 15, gc: 15, pts: 5 },
  { name: 'Real madrid', pj: 3, g: 1, e: 1, p: 1, gf: 7, gc: 6, pts: 4 },
  { name: 'Danubio', pj: 3, g: 1, e: 1, p: 1, gf: 9, gc: 12, pts: 4 },
  { name: 'San jose', pj: 4, g: 0, e: 1, p: 3, gf: 10, gc: 19, pts: 1 },
  { name: 'Milan', pj: 3, g: 0, e: 0, p: 3, gf: 7, gc: 13, pts: 0 }
];

async function main() {
  console.log('--- Starting simulation seed ---');

  try {
    const tournament = await prisma.tournament.findFirst({ where: { name: 'Torneo Relámpago' } });
    const category = await prisma.category.findFirst({ where: { name: 'Categoría A' } });

    if (!tournament || !category) {
      throw new Error('Tournament or Category not found. Run seed_tournament.ts first.');
    }

    console.log('Creating matches...');
    for (const m of matchesToCreate) {
      const homeTeam = await prisma.team.findFirst({ where: { name: m.home } });
      const awayTeam = await prisma.team.findFirst({ where: { name: m.away } });

      if (!homeTeam || !awayTeam) {
        console.warn(`Warning: Could not find teams for ${m.home} vs ${m.away}`);
        continue;
      }

      await prisma.match.create({
        data: {
          tournamentId: tournament.id,
          categoryId: category.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          matchDate: new Date(),
          status: MatchStatus.FINISHED
        }
      });
    }

    console.log('Updating team standings stats...');
    for (const stat of teamStats) {
      const team = await prisma.team.findFirst({ where: { name: stat.name } });
      if (team) {
        await prisma.team.update({
          where: { id: team.id },
          data: {
            matchesPlayed: stat.pj,
            matchesWon: stat.g,
            matchesDrawn: stat.e,
            matchesLost: stat.p,
            goalsFor: stat.gf,
            goalsAgainst: stat.gc,
            goalDifference: stat.gf - stat.gc,
            points: stat.pts
          }
        });
        console.log(`Updated stats for ${stat.name}`);
      }
    }

    console.log('--- Simulation completed successfully ---');
  } catch (error) {
    console.error('Error during simulation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
