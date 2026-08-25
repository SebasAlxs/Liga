const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.findMany({
    select: { id: true, teamId: true, createdAt: true },
  });

  let created = 0;
  for (const player of players) {
    const existing = await prisma.playerTeamHistory.findFirst({
      where: { playerId: player.id },
    });
    if (existing) continue;

    await prisma.playerTeamHistory.create({
      data: {
        playerId: player.id,
        teamId: player.teamId,
        startDate: player.createdAt,
        endDate: null,
      },
    });
    created++;
  }

  console.log(`Backfill completo. ${created} registros de historial creados de ${players.length} jugadores.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
