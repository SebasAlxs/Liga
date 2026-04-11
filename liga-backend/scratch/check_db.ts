import prisma from '../src/infrastructure/db/prisma/PrismaClient';

async function checkTable() {
    try {
        console.log("Checking MatchLineup table...");
        const count = await prisma.matchLineup.count();
        console.log("MatchLineup count:", count);
    } catch (error: any) {
        console.error("Error checking MatchLineup table:", error.message);
        if (error.message.includes("relation \"MatchLineup\" does not exist")) {
            console.log("SUGGESTION: Need to run prisma migrate.");
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkTable();
