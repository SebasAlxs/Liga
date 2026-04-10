const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding tournaments and categories...');

    // Create Categories
    const catSeniorA = await prisma.category.create({
        data: { name: 'Sénior A' }
    });
    const catSeniorB = await prisma.category.create({
        data: { name: 'Sénior B' }
    });
    const catFemenino = await prisma.category.create({
        data: { name: 'Femenino' }
    });

    console.log('Categories created:', [catSeniorA.name, catSeniorB.name, catFemenino.name]);

    // Create Tournaments
    const tourApertura = await prisma.tournament.create({
        data: { name: 'Torneo Apertura 2026', active: true }
    });
    const tourClausura = await prisma.tournament.create({
        data: { name: 'Torneo Clausura 2026', active: false }
    });

    console.log('Tournaments created:', [tourApertura.name, tourClausura.name]);

    // Assign existing teams to a category if any
    const teams = await prisma.team.findMany();
    if (teams.length > 0) {
        for (const team of teams) {
            await prisma.team.update({
                where: { id: team.id },
                data: { categoryId: catSeniorA.id }
            });
        }
        console.log(`Assigned ${teams.length} teams to Sénior A`);
    }

    // Assign existing matches to tournament and category if any
    const matches = await prisma.match.findMany();
    if (matches.length > 0) {
        for (const match of matches) {
            await prisma.match.update({
                where: { id: match.id },
                data: {
                    tournamentId: tourApertura.id,
                    categoryId: catSeniorA.id
                }
            });
        }
        console.log(`Assigned ${matches.length} matches to Apertura 2026 and Sénior A`);
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
