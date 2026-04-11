const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@liga.com',
      password: 'admin123',
      role: 'SUPERADMIN'
    },
    {
      email: 'vocal@liga.com',
      password: 'vocal123',
      role: 'VOCAL'
    }
  ];

  console.log('Seeding users...');
  
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        role: userData.role,
        password: hashedPassword
      },
      create: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      }
    });
    console.log(`Created/Updated user: ${user.email} with role ${user.role}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
