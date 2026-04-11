import prisma from '../src/infrastructure/db/prisma/PrismaClient';

async function seed() {
  try {
    console.log("🌱 Starting seeding test data...");

    // 1. Sede
    const sede = await prisma.headquarters.create({
      data: {
        name: "Complejo Deportivo Central",
        city: "Quito",
        address: "Av. de los Granados",
      }
    });
    console.log("✅ Headquarters created:", sede.name);

    // 2. Torneo
    const torneo = await prisma.tournament.create({
      data: {
        name: "Copa Primavera 2026",
        headquartersId: sede.id,
        active: true
      }
    });
    console.log("✅ Tournament created:", torneo.name);

    // 3. Categoría
    const categoria = await prisma.category.create({
      data: {
        name: "Máxima Categoría"
      }
    });
    console.log("✅ Category created:", categoria.name);

    // 4. Equipos
    const teamA = await prisma.team.create({
      data: {
        name: "FC Lobos",
        tournamentId: torneo.id,
        categoryId: categoria.id,
        foundedYear: 2010
      }
    });
    const teamB = await prisma.team.create({
      data: {
        name: "Halcones Galácticos",
        tournamentId: torneo.id,
        categoryId: categoria.id,
        foundedYear: 2015
      }
    });
    console.log("✅ Teams created:", teamA.name, "vs", teamB.name);

    // 5. Jugadores
    const playersA = [
      { firstName: "Juan", lastName: "Pérez", number: 10 },
      { firstName: "Carlos", lastName: "Mendes", number: 7 },
      { firstName: "Luis", lastName: "Suárez", number: 9 },
      { firstName: "Pepe", lastName: "Guardia", number: 1 },
      { firstName: "Andrés", lastName: "Iniesta", number: 8 },
    ];

    const playersB = [
      { firstName: "Roberto", lastName: "Gómez", number: 10 },
      { firstName: "Mario", lastName: "Bros", number: 5 },
      { firstName: "Luigi", lastName: "Verde", number: 4 },
      { firstName: "Bowser", lastName: "Rey", number: 99 },
      { firstName: "Toad", lastName: "Hongo", number: 3 },
    ];

    for (const p of playersA) {
      await prisma.player.create({ data: { ...p, teamId: teamA.id } });
    }
    for (const p of playersB) {
      await prisma.player.create({ data: { ...p, teamId: teamB.id } });
    }
    console.log("✅ Players created (5 per team)");

    // 6. Partido
    const match = await prisma.match.create({
      data: {
        matchDate: new Date(),
        homeTeamId: teamA.id,
        awayTeamId: teamB.id,
        tournamentId: torneo.id,
        categoryId: categoria.id,
        status: 'SCHEDULED'
      }
    });
    console.log("✅ Match created:", teamA.name, "vs", teamB.name);

    console.log("\n🚀 Seeding finished successfully!");
    console.log("Match ID to select in UI:", match.id);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
