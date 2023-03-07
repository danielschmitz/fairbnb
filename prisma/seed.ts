import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

  const admin = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: Role.ADMIN
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'user',
      email: 'user@user.com',
      password: 'user',
      role: Role.USER
    }
  }); 

  const host = await prisma.user.create({
    data: {
      name: 'host',
      email: 'host@host.com',
      password: 'host',
      role: Role.HOST
    }
  }); 

  console.log({admin, user, host});

}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })