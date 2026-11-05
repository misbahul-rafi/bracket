const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { hash } = require('bcrypt');

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = ['admin', 'user'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const hashedPassword = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      name: 'Admin',
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      name: 'Admin',
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Seed completed: roles and admin user created');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
