const { PrismaMatchRepository } = require("./src/infrastructure/db/prisma/repositories/PrismaMatchRepository");
const { PrismaClient } = require("@prisma/client");
const fs = require('fs');

async function test() {
  const prisma = new PrismaClient();
  try {
    const r = await prisma.match.update({
      where: { id: "01140c9b-3145-49c3-92f9-093a95bf9bdb" },
      data: { refereeId: null }
    });
    console.log(r);
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  }
  process.exit(0);
}
test();
