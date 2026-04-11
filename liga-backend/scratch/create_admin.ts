import bcrypt from "bcryptjs";
import prisma from '../src/infrastructure/db/prisma/PrismaClient';

async function createAdmin() {
  const email = "admin@liga.com";
  const password = "admin123";
  
  try {
    console.log("Checking for existing admin...");
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      console.log("⚠️ Admin user already exists. Updating password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, role: 'SUPERADMIN' }
      });
      console.log("✅ Admin updated successfully!");
    } else {
      console.log("🚀 Creating new SUPERADMIN user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'SUPERADMIN'
        }
      });
      console.log("✅ Admin created successfully!");
    }
    
    console.log("\n---------------------------");
    console.log("CREDENTIALS:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("---------------------------\n");

  } catch (error) {
    console.error("❌ Failed to create admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
