import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "pkbilalvalove@gmail.com";

  const hashedPassword = await bcrypt.hash(
    "KSTS@Admin2026",
    10
  );

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },

    create: {
      name: "Bilal Ahmed",
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("Super Admin Ready:");
  console.log(admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });