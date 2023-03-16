import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = bcrypt.hashSync("123456", 10);

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@admin.com",
      password: hash,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "user",
      email: "user@user.com",
      password: hash,
      role: Role.USER,
    },
  });

  const host = await prisma.user.create({
    data: {
      name: "host",
      email: "host@host.com",
      password: hash,
      role: Role.HOST,
    },
  });

  console.log({ admin, user, host });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
